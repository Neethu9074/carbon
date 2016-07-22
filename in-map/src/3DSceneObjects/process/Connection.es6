import {combineLatest} from 'reactive-observables';
import THREE from 'three';

import GhostEdgeSpawnerComponent from 'in-map/src/components/process/GhostEdgeSpawnerComponent';
import HealthComponent from 'in-map/src/components/common/HealthComponent/HealthComponent';
import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import CLCP from 'in-map/src/SingleMeshFactory/ContentProvider/LineContentProvider';
import {edges$, addEdge, removeEdge} from 'in-map/src/stores/process/edgesStore';
import {selectedSnapshotIdForHighlightingInMap} from 'in-map/src/mapStores';
import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import BaseConnection from 'in-map/src/3DSceneObjects/common/Connection';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import {requestRendering} from 'in-map/src/stores/renderingStore';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import {eventBus} from 'in-map/src/services/eventBus';
import {theme} from 'in-services/theme';


const UP = new THREE.Vector3(0, 1, 0);

export default class Connection extends BaseConnection {

  constructor(params) {
    super(params);

    this.addSubscriptions([
      this.sourceNode.eventEmitter.on('positionChanged')
      .merge(this.destinationNode.eventEmitter.on('positionChanged'))
        .debounce(10)
        .subscribe(() => this.positionChanged()),

      eventBus.on('endUpdate').subscribe(() => this.getComponent('screenPosition').updateScreenPosition()),

      combineLatest([
        this.eventEmitter.on('healthChanged'),
        highlightedEntityId$,
        selectedSnapshotIdForHighlightingInMap
      ]).subscribe(([maxSeverity, highlightedEntityId, selectedEntityId]) => {
        const isHighlighted = highlightedEntityId === this.id || selectedEntityId === this.id;
        const colorIndex = Math.floor(maxSeverity);

        this.colorChanged(isHighlighted ?
          theme.health[colorIndex] :
          theme.lightHealth[colorIndex]);
      }),

      this.eventEmitter.on('updateGeometry').debounce(10).subscribe(this.updateGeometry.bind(this)),
      this.eventEmitter.on('updateColor').debounce(10).subscribe(this.updateColor.bind(this)),

      edges$.subscribe(allEdges => this.checkIfBidirectional(allEdges))
    ]);

    // create this later, afer sourceNode and destinationNode are available
    this.components.ghostEdgeSpawner = new GhostEdgeSpawnerComponent({sceneObject: this});

    addEdge(this);
  }

  init() {
    this.currentColor = theme.health[0];
    this.isBidirectional = false;
    this.lineSMF = this.getFactory();

    super.init();
  }

  initComponents() {
    super.initComponents();

    const components = this.components;
    const sceneObject = this;

    components.screenPosition = new ScreenPositionComponent({sceneObject, id: '_screenPosition'});
    components.health = new HealthComponent({sceneObject});
  }

  getFactory() {
    return this.parent.getFactory('dashedLineSMF');
  }

  setupGeometry() {
    this.lineFragment = {
      id: this.id,
      contentProvider: new CLCP()
    };
  }

  calculatePath(fromPos, toPos) {
    // move the path a little so that the source/target position is in the middle of the geometry
    fromPos.x -= 0.5;
    fromPos.z += 0.5;
    toPos.x -= 0.5;
    toPos.z += 0.5;

    if (this.isBidirectional) {
      const direction = new THREE.Vector3(toPos.x - fromPos.x, 0, toPos.z - fromPos.z).normalize();
      const forward = direction.clone().multiplyScalar(0.075);
      const right = direction.cross(UP).multiplyScalar(0.25);
      fromPos.add(right);
      fromPos.sub(forward);
      toPos.add(right);
      toPos.add(forward);
    }

    return [fromPos, toPos];
  }

  updateGeometry() {
    const vertices = this.getLineVertices(this.sourceNode, this.destinationNode);
    this.lineFragment.contentProvider.setLines(vertices);

    this.lineFragment.contentProvider.setColor(this.getColors());

    this.lineSMF.addFragment(this.lineFragment);
  }

  updateColor() {
    this.lineFragment.contentProvider.setColor(this.getColors());

    this.lineSMF.addFragment(this.lineFragment);
  }

  getColors() {
    return this.getColor(hexToRGBNormalized(this.currentColor));
  }

  positionChanged() {
    this.eventEmitter.emit('updateGeometry');

    const from = this.direction === DIRECTIONS.OUT ? this.sourceNode : this.destinationNode;
    const to = this.direction === DIRECTIONS.OUT ? this.destinationNode : this.sourceNode;
    const fromPos = from.getComponent('position').getPosition().clone();
    const toPos = to.getComponent('position').getPosition().clone();
    const pos = fromPos.add(toPos.sub(fromPos).multiplyScalar(0.5));

    this.getComponent('screenPosition').set3DPositionToProject(pos.x - 0.5, 0, pos.z + 0.5);

    requestRendering();
  }

  colorChanged(newColor) {
    if (this.currentColor === newColor) {
      return;
    }

    this.currentColor = newColor;
    this.eventEmitter.emit('updateColor');
  }

  checkIfBidirectional(allEdges) {
    let isBidirectional = false;
    const keys = Object.keys(allEdges);
    for (let i = 0, length = keys.length; i < length; i++) {
      const connection = allEdges[keys[i]];
      if (connection.sourceNode.id === this.destinationNode.id &&
          connection.destinationNode.id === this.sourceNode.id) {
        isBidirectional = true;
        break;
      }
    }

    if (this.isBidirectional !== isBidirectional) {
      this.isBidirectional = isBidirectional;
      this.eventEmitter.emit('updateGeometry');
    }
  }

  dispose() {
    removeEdge(this);

    super.dispose();

    // remove fragment first to save the id
    this.lineSMF.removeFragment(this.id);
    this.lineSMF = null;

    this.lineFragment = null;
    this.currentColor = null;
    this.isBidirectional = null;
  }
}
