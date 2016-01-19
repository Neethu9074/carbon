import THREE from 'three';

import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';

import CollisionComponent from '../../../components/CollisionObjectComponent';
import MeshComponent from '../../../components/MeshComponent';

import {cubeGeometry, defaultGeometryMaterial} from '../../geometries';
import SceneObjectWithSnapshot from '../../SceneObjectWithSnapshot';

import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from '../../../SingleMeshFactory/ContentProvider/CylinderContentProvider';

export default class Node extends SceneObjectWithSnapshot {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});
  }

  onHighlightEnter() {
    highlightedSnapshot.setHighlightedEntityId(this.id);
  }

  onHighlightLeave() {
    highlightedSnapshot.clearHighlightedEntityId();
  }

  onSelectedHighlightEnter() {
    highlightedSnapshot.setHighlightedEntityId(this.id);
  }

  onSelectedHighlightLeave() {
    highlightedSnapshot.clearHighlightedEntityId();
  }


  initComponents() {
    super.initComponents();

    const components = this.components;

    // add the mesh component to handle visual representation of the node
    components.mesh = new MeshComponent({
      sceneObject: this,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CCP()
          })
        })
      }),
      factory: this.scene.singleMeshFactory
    });
    this.getComponent('mesh').colorChanged(Math.random(), Math.random(), Math.random());

    // add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject: this,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });
  }

  onSnapshotUpdated() {}

  positionChanged(x, y, z) {
    this.getComponent('mesh').positionChanged(x, y, z);
    this.getComponent('collision').positionChanged(x, y, z);
  }

  dispose() {
    super.dispose();
  }
}
