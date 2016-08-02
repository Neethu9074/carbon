import CHCP from 'in-map/singleMeshFactories/ContentProvider/CylinderHighlightingContentProvider';
import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import CCP from 'in-map/singleMeshFactories/ContentProvider/CylinderContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import ServiceStickyNote from 'in-map/components/stickyNotes/logical/Service';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';
import IconComponent from 'in-map/sceneObjectComponents/IconComponent';

import stickyNotes from 'in-map/stores/stickyNotes/stickyNotes';
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

    stickyNotes.add(this.id, {
      type: ServiceStickyNote,
      eventEmitter: this.eventEmitter,
      props: {
        id: this.id
      }
    });
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

    this.addComponent('screenPosition', new ScreenPositionComponent(this, (pos, scale) => {
      return {
        x: pos.x + scale.x / 2,
        y: pos.y + scale.y + 0.75,
        z: pos.z - scale.z / 2
      };
    }));
  }

  dispose() {
    super.dispose();

    stickyNotes.remove(this.id);
    services.remove(this.id);
  }
}
