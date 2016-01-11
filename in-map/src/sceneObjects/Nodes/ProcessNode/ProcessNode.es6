import THREE from 'three';

import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';
import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {isMatchingAllActiveFilters} from 'in-services/stores/filters';
import {getFullSnapshot} from 'in-services/snapshots';

import CollisionComponent from '../../../components/CollisionObjectComponent';
import MeshComponent from '../../../components/MeshComponent';

import {cubeGeometry, defaultGeometryMaterial} from '../../geometries';
import SceneObject from '../../SceneObject';

import CCP from '../../../SingleMeshFactory/ContentProvider/CubeContentProvider';
import CMCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';

export default class Node extends SceneObject {

  constructor({parent, coordinates, id}) {
    super({parent, id});

    this.registerEvents(coordinates);
  }

  onSelectedEnter() {
    super.onSelectedEnter();

    // snapshots may not yet exist yet when switching views.
    if (this.snapshot) {
      selectedSnapshot.select(this.snapshot);
    }
  }

  onSelectedHighlightEnter() {
    super.onSelectedHighlightEnter();

    selectedSnapshot.select(this.snapshot);
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

  registerEvents(coordinates) {
    this.addSubscription(getFullSnapshot(coordinates).subscribe(snapshot =>
      this.onSnapshotUpdate(snapshot))
    );

    this.addSubscription(isMatchingAllActiveFilters(coordinates).subscribe(isVisible => {
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
