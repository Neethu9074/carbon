import THREE from 'three';

import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';
import {isMatchingAllActiveFilters} from 'in-services/stores/filters';
import {getFullSnapshot} from 'in-services/snapshots';

import CollisionComponent from '../../../components/CollisionObjectComponent';
import MeshComponent from '../../../components/MeshComponent';

import {cubeGeometry, defaultGeometryMaterial} from '../../geometries';
import SceneObject from '../../SceneObject';

import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from '../../../SingleMeshFactory/ContentProvider/CubeContentProvider';

export default class Node extends SceneObject {

  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.registerEvents();
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

  registerEvents() {
    this.addSubscription(getFullSnapshot(this.id).subscribe(snapshot => this.onSnapshotUpdate(snapshot)));

    this.addSubscription(isMatchingAllActiveFilters(this.id).subscribe(isVisible => {
      if (isVisible) {
        this.show();
      } else {
        this.hide();
      }
    }));
  }

  onHighlight(highlighted) {
    super.onHighlight(highlighted);

    if (this.snapshot) {
      if (highlighted) {
        highlightedSnapshot.select(this.snapshot);
      } else {
        highlightedSnapshot.clear();
      }
    }
  }

  onSnapshotUpdate(snapshot) {
    // if the reference is equal, don't update. the reference is always equal
    // on the same snapshots because they are immutable
    if (this.snapshot === snapshot) {
      return;
    }

    this.snapshot = snapshot;
  }

  positionChanged(x, y, z) {
    this.getComponent('mesh').positionChanged(x, y, z);
    this.getComponent('collision').positionChanged(x, y, z);
  }

  dispose() {
    super.dispose();
  }
}
