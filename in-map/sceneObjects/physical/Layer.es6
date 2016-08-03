import CHCP from 'in-map/singleMeshFactories/ContentProvider/CubeHighlightingContentProvider';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import CCP from 'in-map/singleMeshFactories/ContentProvider/CubeContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import IconComponent from 'in-map/sceneObjectComponents/IconComponent';

import SceneObject from 'in-map/sceneObjects/SceneObject';
import {focusEntityId$} from 'in-map/stores/focusEntity';
import {collisionDetection} from 'in-map/misc/Physics';
import {eventBus} from 'in-map/services/eventBus';


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

    this.addComponent('health', new HealthComponent(this));

    // only add them after the components where setup, because the layouter needs the transform component
    this.node.addLayer(this.id, this);
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      focusEntityId$.subscribe(id => {
        if (this.id === id) {
          eventBus.emit('focusPosition', this.getComponent('transform').getPosition());
        }
      })
    );
  }

  dispose() {
    super.dispose();

    this.node.removeLayer(this.id);
    this.node = null;
  }
}
