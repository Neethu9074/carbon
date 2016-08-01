import CHCP from 'in-map/singleMeshFactories/ContentProvider/CylinderHighlightingContentProvider';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import CCP from 'in-map/singleMeshFactories/ContentProvider/CylinderContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import IconComponent from 'in-map/sceneObjectComponents/IconComponent';

import SceneObject from 'in-map/sceneObjects/SceneObject';
import {collisionDetection} from 'in-map/misc/Physics';
import services from 'in-map/stores/logical/services';


export default class Service extends SceneObject {

  constructor(params) {
    super(params.id);
  }

  init() {
    super.init();

    services.add(this.id, this);
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, CCP, 'nodes'));
    this.addComponent('collision', new CollisionComponent(this,
                                                          collisionDetection.predefinedCollisionObjects.Box,
                                                          collisionDetection.OCTREE_LAYER.NODES));
    this.addComponent('icon', new IconComponent(this, 3, (pos, scale) => {
      return {
        x: 0,
        y: scale.y + 0.75,
        z: 0
      };
    }));
    this.addComponent('snapshot', new SnapshotComponent(this));
    this.addComponent('highlighting', new HighlightingComponent(this, CHCP));

    this.getComponent('transform').setScaleXYZ(1, 0.25, 1);
  }

  dispose() {
    super.dispose();

    services.remove(this.id);
  }
}
