import { combineLatest } from 'reactive-observables';

import LCP from 'in-map/singleMeshFactories/ContentProvider/LineContentProvider';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import {
  shortenPathAtSourceAndDestination,
  updatePhysicalCollisionMesh,
  physicalCollisionMesh,
  addArrowToDestination,
  getManhattanPath,
  intersects,
  flatten
} from 'in-map/misc/Connections';
import { requestRendering } from 'in-map/stores/renderingStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import connections from 'in-map/stores/connectionsStore';

export default class Connection extends SceneObject {
  constructor(params) {
    super(params);

    this.destinationNode = params.destinationNode;
    this.sourceNode = params.sourceNode;

    // connection Ids are generated in the backend by generateIdForConnection(String sourceId, String destinationId, String relation)
    // so it can happen that connections are instanced twice (A is selected and connected to B and the user highlights B: The connection between A and B,
    // which has the same id is instanced twice). If B is un-highlighted it will "steal" the id of selected A->B connection and it cannot be hovered anymore
    // becuase the id is not part of the connections collection anymore. Since the UI is not interested in connection IDs, but only for collection handling
    // (so no snapshot retrieval, etc.) we can simply make it unique by addind the current timestamp to the id.
    this.uidForMultipleInstanceHandling = `${this.id}__${Date.now()}`;
  }

  init() {
    super.init();

    this.collisionLine = physicalCollisionMesh();
  }

  initComponents() {
    super.initComponents({ color: 0xbababa });

    this.lineContentProvider = new LCP(this.getVertices.bind(this), this.getColors.bind(this));
    this.addComponent('mesh', new MeshComponent(this, this.lineContentProvider, 'connections'));

    this.getComponent('color').setHex('#bababa');
    this.getComponent('transform').setPositionXYZ(0, 0, 0);

    connections.add(this.uidForMultipleInstanceHandling, this);
  }

  initEvents() {
    super.initEvents();

    // if source and destination nodes were disposed, this check is true. This can happen when nodes
    // vanish and the conenctions are still active
    if (!this.sourceNode.eventEmitter || !this.destinationNode.eventEmitter) {
      return;
    }

    this.addSubscriptions([
      combineLatest([
        this.sourceNode.eventEmitter.on('transformationChanged'),
        this.destinationNode.eventEmitter.on('transformationChanged')
      ]).subscribe(([fromTransform, toTransform]) => {
        updatePhysicalCollisionMesh(this.collisionLine, fromTransform.position, toTransform.position);
        this.eventEmitter.emit('transformationChanged', {
          position: this.getPosition(),
          scale: this.getComponent('transform').getScale()
        });
        requestRendering();
      })
    ]);
  }

  getVertices() {
    if (!this.sourceNode || !this.destinationNode) {
      return [];
    }

    const from = this.sourceNode.getPosition();
    const to = this.destinationNode.getPosition();
    if (!from || !to) {
      return [];
    }

    return flatten(
      addArrowToDestination(shortenPathAtSourceAndDestination(getManhattanPath(from.x, from.z, to.x, to.z)))
    );
  }

  getColors(vertices) {
    const colors = [];
    for (let i = 0, length = vertices.length; i < length; i++) {
      colors.push(1);
    }
    return colors;
  }

  intersects(raycaster) {
    return intersects(raycaster, this.collisionLine);
  }

  dispose() {
    super.dispose();

    connections.remove(this.uidForMultipleInstanceHandling);

    this.collisionLine.geometry.dispose();
    this.collisionLine = null;

    this.lineContentProvider = null;
    this.destinationNode = null;
    this.sourceNode = null;
  }
}
