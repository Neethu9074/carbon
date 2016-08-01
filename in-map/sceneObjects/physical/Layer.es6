import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import IconComponent from 'in-map/sceneObjectComponents/IconComponent';

import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {collisionDetection} from 'in-map/misc/Physics';
import layer from 'in-map/stores/physical/layer';


export default class Layer extends SceneObject {

  constructor(params) {
    super(params.id);

    this.node = params.node;
  }

  init() {
    super.init();

    const layerCollection = layer.objects[this.node.id];
    layerCollection.add(this.id, this);
  }

  initComponents() {
    super.initComponents();

    this.addComponent('mesh', new MeshComponent(this, CCP, 'layer'));
    this.addComponent('collision', new CollisionComponent(this, collisionDetection.predefinedCollisionObjects.Box, 0));
    this.addComponent('icon', new IconComponent(this, 1, (pos, scale) => {
      return {
        x: scale.x / 2 + 0.1,
        y: scale.y / 2,
        z: scale.z / 2 + 0.1
      };
    }));
    this.addComponent('snapshot', new SnapshotComponent(this));
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      highlightedEntityId$.subscribe(id => {
        if (id === this.id) {
          console.log('THIS');
        }
      })
    ]);
  }

  dispose() {
    super.dispose();

    this.node = null;
  }
}
