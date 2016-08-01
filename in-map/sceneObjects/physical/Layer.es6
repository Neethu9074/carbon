import CHCP from 'in-map/singleMeshFactories/ContentProvider/CubeHighlightingContentProvider';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import IconComponent from 'in-map/sceneObjectComponents/IconComponent';

import SceneObject from 'in-map/sceneObjects/SceneObject';
import {collisionDetection} from 'in-map/misc/Physics';
import layer from 'in-map/stores/physical/layer';


export default class Layer extends SceneObject {

  constructor(params) {
    super(params.id);

    this.node = params.node;
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, CCP, 'layer'));
    this.addComponent('collision', new CollisionComponent(this,
                                                          collisionDetection.predefinedCollisionObjects.Box,
                                                          collisionDetection.OCTREE_LAYER.LAYER));
    this.addComponent('icon', new IconComponent(this, 1, (pos, scale) => {
      return {
        x: scale.x / 2 + 0.1,
        y: scale.y / 2,
        z: scale.z / 2 + 0.1
      };
    }));
    this.addComponent('snapshot', new SnapshotComponent(this));
    this.addComponent('highlighting', new HighlightingComponent(this, CHCP));

    // only add them after the components where setup, because the layouter needs the transform component
    const layerCollection = layer.objects[this.node.id];
    layerCollection.add(this.id, this);
  }

  dispose() {
    super.dispose();

    this.node = null;
  }
}
