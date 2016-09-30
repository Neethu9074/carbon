import {combineLatest} from 'reactive-observables';

import LCP from 'in-map/singleMeshFactories/ContentProvider/LineContentProvider';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import {
  shortenPathAtSourceAndDestination,
  calculatePhysicalCollisionMesh,
  addArrowToDestination,
  getManhattanPath,
  intersects,
  flatten
} from 'in-map/misc/Connections';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import connections from 'in-map/stores/connectionsStore';


export default class Connection extends SceneObject {

  constructor(params) {
    super(params);

    this.destinationNode = params.destinationNode;
    this.sourceNode = params.sourceNode;
  }

  initComponents() {
    super.initComponents({color: 0xbababa});

    this.lineContentProvider = new LCP(this.getVertices.bind(this), this.getColors.bind(this));
    this.addComponent('mesh', new MeshComponent(this, this.lineContentProvider, 'connections'));

    this.getComponent('color').setHex('#bababa');
    this.getComponent('transform').setPositionXYZ(0, 0, 0);

    connections.add(this.id, this);
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
        this.sourceNode.eventEmitter.on('positionChanged'),
        this.destinationNode.eventEmitter.on('positionChanged')
      ]).subscribe(([from, to]) => {
        if (this.collisionLine) {
          this.collisionLine.geometry.dispose();
        }
        this.collisionLine = calculatePhysicalCollisionMesh(from, to);
      })
    ]);
  }

  getVertices() {
    const from = this.sourceNode.getComponent('transform').getPosition();
    const to = this.destinationNode.getComponent('transform').getPosition();

    return flatten(
           addArrowToDestination(
           shortenPathAtSourceAndDestination(
           getManhattanPath(from.x, from.z, to.x, to.z))));
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

    connections.remove(this.id);

    if (this.collisionLine) {
      this.collisionLine.geometry.dispose();
      this.collisionLine = null;
    }

    this.lineContentProvider = null;
    this.destinationNode = null;
    this.sourceNode = null;
  }
}
