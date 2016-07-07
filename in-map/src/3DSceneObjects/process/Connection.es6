import GhostEdgeSpawnerComponent from 'in-map/src/components/process/GhostEdgeSpawnerComponent';
import HealthComponent from 'in-map/src/components/common/HealthComponent/HealthComponent';
import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import {addEdge, removeEdge} from 'in-map/src/stores/process/edgesStore';
import BaseConnection from 'in-map/src/3DSceneObjects/common/Connection';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import {requestRendering} from 'in-map/src/stores/renderingStore';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import eventBus from 'in-map/src/eventbus';
import {theme} from 'in-services/theme';

import CLCP from '../../SingleMeshFactory/ContentProvider/ColoredLineContentProvider';


export default class Connection extends BaseConnection {

  constructor(params) {
    super(params);

    this.addSubscriptions([
      this.sourceNode.eventEmitter.on('positionChanged')
      .merge(this.destinationNode.eventEmitter.on('positionChanged'))
        .debounce(10)
        .subscribe(() => this.positionChanged()),

      eventBus.on('endUpdate').subscribe(() => this.getComponent('screenPosition').updateScreenPosition()),

      this.eventEmitter.on('healthChanged').subscribe(this.healthChanged.bind(this)),

      this.eventEmitter.on('updateGeometry').debounce(10)
                                            .subscribe(this.updateGeometry.bind(this))
    ]);

    // create this later, afer sourceNode and destinationNode are available
    this.components.ghostEdgeSpawner = new GhostEdgeSpawnerComponent({sceneObject: this});

    addEdge(this);
  }

  onSelectedEnter() {}

  onSelectedLeave() {}


  init() {
    this.currentColor = theme.health[0];
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

  getColors() {
    const rgb = hexToRGBNormalized(this.currentColor);
    return this.getColorArrayFromRgb(rgb.r, rgb.g, rgb.b);
  }

  calculatePath(fromPos, toPos) {
    // move the path a little so that the source/target position is in the middle of the geometry
    fromPos.x -= 0.5;
    fromPos.z += 0.5;
    toPos.x -= 0.5;
    toPos.z += 0.5;

    return [fromPos, toPos];
  }

  updateGeometry() {
    const vertices = this.getLineVertices(this.sourceNode, this.destinationNode);
    this.lineFragment.contentProvider.setLines(vertices);

    // the default color must be set to get a working shader.
    // it's black so you can see if there is a snapshot missing
    this.lineFragment.contentProvider.setColor(this.getColors());

    this.lineSMF.addFragment(this.lineFragment);
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

  healthChanged(maxSeverity) {
    this.currentColor = maxSeverity > 0 ? theme.health[Math.floor(maxSeverity)] : '#bababa';
    this.eventEmitter.emit('updateGeometry');
  }

  dispose() {
    removeEdge(this);

    // remove fragment first to save the id
    this.lineSMF.removeFragment(this.id);
    this.lineSMF = null;

    super.dispose();
    this.lineFragment = null;
  }
}
