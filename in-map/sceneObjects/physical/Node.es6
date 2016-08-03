import CHCP from 'in-map/singleMeshFactories/ContentProvider/CubeHighlightingContentProvider';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import IconComponent from 'in-map/sceneObjectComponents/IconComponent';

import createObjectCollectionStream from 'in-map/stores/ObjectColletionStream';
import createLayerLayouter from 'in-map/misc/physical/LayerLayouter';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {collisionDetection} from 'in-map/misc/Physics';
import nodes from 'in-map/stores/physical/nodes';


export default class Node extends SceneObject {

  constructor(params) {
    super(params.id);

    this.group = params.group;
    this.layer = createObjectCollectionStream();
    this._cachedLabel = this.id;
  }

  init() {
    super.init();

    nodes.add(this.id, this);
    this.group.addNode(this.id, this);

    this.layerLayouter = createLayerLayouter(this);
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, CCP, 'nodes'));

    this.addComponent('collision', new CollisionComponent(this,
                                                          collisionDetection.predefinedCollisionObjects.Box,
                                                          collisionDetection.OCTREE_LAYER.NODES));

    this.addComponent('icon', new IconComponent(this, 3, (pos, scale) => {
      return {
        x: scale.x / 2,
        y: scale.y + 0.25,
        z: -scale.z / 2
      };
    }));

    this.addComponent('snapshot', new SnapshotComponent(this));

    this.addComponent('highlighting', new HighlightingComponent(this, CHCP));

    this.addComponent('health', new HealthComponent(this));
  }

  addLayer(id, node) {
    this.layer.add(id, node);
  }

  removeLayer(id) {
    this.layer.remove(id);
  }

  dispose() {
    super.dispose();

    this.layerLayouter.dispose();
    this.layerLayouter = null;

    nodes.remove(this.id);
    this.group.removeNode(this.id);

    this._cachedLabel = null;
    this.group = null;
  }
}
