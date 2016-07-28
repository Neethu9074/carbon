import THREE from 'three';

import HighlightingComponent from 'in-map/src/components/process/HighlightingComponentForCylinder';
import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import CollisionComponent from 'in-map/src/components/common/CollisionObjectComponent';
import SolidMeshComponent from 'in-map/src/components/process/SolidMeshComponent';
import MeshComponent from 'in-map/src/components/common/MeshComponent';

import CMCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from 'in-map/src/SingleMeshFactory/ContentProvider/CylinderContentProvider';

import {cubeGeometry, defaultGeometryMaterial} from 'in-map/src/3DSceneObjects/common/geometries';
import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster';
import Label from 'in-map/src/3DSceneObjects/process/Label';
import Node from 'in-map/src/3DSceneObjects/process/Node';


export default class NodeUnknownExitService extends Node {

  constructor(props) {
    super(props);

    this.label = new Label({
      id: this.id,
      parent: this,
      snapshotId: this.id,
      iconSize: 2.75
    });

    this.eventEmitter.emit('isFullyVisible', false);
    this.eventEmitter.emit('sizeChanged', { x: 0.5, y: this.height, z: 0.5 });
  }

  init() {
    this.height = 0.5;
  }

  addComponents(components) {
    const sceneObject = this;

    // add the mesh component to handle visual representation of the entity
    components.mesh = new MeshComponent({
      sceneObject,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CCP()
          })
        })
      }),
      factory: this.getFactory('fadeByDistanceSMF')
    });

    components.solidMesh = new SolidMeshComponent({
      sceneObject,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CCP()
          })
        })
      }),
      factory: this.getFactory('solidSMF')
    });

    // add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });

    components.highlight = new HighlightingComponent({sceneObject});

    components.screenPosition = new ScreenPositionComponent({
      sceneObject: this,
      id: '_screenPosition'
    });
  }

  updateScreenPosition() {
    this.getComponent('screenPosition').updateScreenPosition();
  }

  positionChanged(newPos) {
    super.positionChanged(newPos);
    this.label.getComponent('position').setPosition(newPos.x - 0.5, this.height + 0.8, newPos.z + 0.5);
  }

  createSticky() {
    return new StickyNote(this);
  }

  getDragGhostGeometry() {
    return new THREE.CylinderBufferGeometry(0.25, 0.25, this.height, 20, 20);
  }

  dispose() {
    super.dispose();

    this.label.dispose();
    this.label = null;
  }
}
