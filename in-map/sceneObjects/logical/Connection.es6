import LCP from 'in-map/singleMeshFactories/ContentProvider/LineContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import SceneObject from 'in-map/sceneObjects/SceneObject';
import {collisionDetection} from 'in-map/misc/Physics';
import connections from 'in-map/stores/logical/connections';


export default class Connection extends SceneObject {

  constructor(params) {
    super(params.id);

    this.sourceNode = params.sourceNode;
    this.destinationNode = params.destinationNode;
  }


  initComponents() {
    super.initComponents();

    this.lineContentProvider = new LCP(this.getVertices.bind(this), this.getColors.bind(this));
    this.addComponent('mesh', new MeshComponent(this, this.lineContentProvider, 'lines'));

    this.addComponent('collision', new CollisionComponent(this,
                                                          collisionDetection.predefinedCollisionObjects.Box,
                                                          collisionDetection.OCTREE_LAYER.NODES));
    this.addComponent('snapshot', new SnapshotComponent(this));

    connections.add(this.id, this);
  }

  getVertices() {
    const fromTransform = this.sourceNode.getComponent('transform');
    const toTransform = this.destinationNode.getComponent('transform');
    if (!fromTransform || !toTransform) {
      return [];
    }
    const from = fromTransform.getPosition();
    const to = toTransform.getPosition();

    return [
      from.x, from.y, from.z,
      to.x, to.y, to.z
    ];
  }

  getColors() {
    return [
      1, 1, 1, 1, 1, 1
    ];
  }

  dispose() {
    super.dispose();

    connections.remove(this.id);

    this.lineContentProvider = null;
    this.destinationNode = null;
    this.sourceNode = null;
  }
}
