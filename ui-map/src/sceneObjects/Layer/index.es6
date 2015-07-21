'use strict';

import THREE from 'three';

import SceneObject from '../SceneObject/index';
import {cubeGeometry} from '../geometries';
import {currentTooltip} from '../../stores/mapStore';
import Tooltip from '../Tooltips/Layer';
import NodeHighlighting from '../Nodes/NodeHighlight';
import CCP from '../../SingleMeshFactory/ContentProvider/CubeContentProvider';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';

import {theme} from 'instana-ui-services/theme';
import {getIdString} from 'instana-ui-services/util/snapshots';


export default class Layer extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.id = getIdString(snapshot);
    this.snapshot = snapshot;
    this.layerIndex = 0; //see this.setLayerIndex

    this.geometryProvider = new CMCM({
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new CCP()
        })
      })
    });

    this.tooltip = new Tooltip(this);
    this.highlighting = new NodeHighlighting({client: this});
    this.render();

    const parentPos = parent.getPosition();
    this.setPosition(parentPos.x, parentPos.y, parentPos.z);
  }

  onInitialEnter() {

  }

  onInitialLeave() {

  }

  onHighlightEnter() {
    currentTooltip.emit(this.tooltip);
    this.highlighting.setHighlight();
  }

  onHighlightLeave() {
    this.highlighting.clearHighlight();
  }

  onInactiveEnter() {
    this.scene.layerSingleMeshFactory.removeFragment(this.id);
    this.removeCollisionObject();
  }

  onInactiveLeave() {
    this.scene.layerSingleMeshFactory.addFragment(this.fragment);
    this.scene.addCollisionObject(this.cube, 1);
  }

  onHiddenEnter() {
    this.scene.layerSingleMeshFactory.removeFragment(this.id);
    this.removeCollisionObject();
  }

  onHiddenLeave() {
    this.scene.layerSingleMeshFactory.addFragment(this.fragment);
    this.scene.addCollisionObject(this.cube, 1);
  }


  render() {
    this.addCollisionObject();
    this.refreshFragment();
  }

  addCollisionObject() {
    const cube = this.cube = new THREE.Mesh(cubeGeometry);
    cube.matrixAutoUpdate = false;
    cube.rotationAutoUpdate = false;
    cube.parentSceneObject = this;
    this.scene.addCollisionObject(cube, 1);
  }

  removeCollisionObject() {
    this.scene.removeCollisionObject(this.cube, 1);
  }

  removeFromGlobalGeometry() {
    this.scene.layerSingleMeshFactory.removeFragment(this.id);
  }

  updateSnapshot(snapshot) {
    this.snapshot = snapshot;
  }

  setPosition(x, y, z) {
    const pos = this.getPosition();
    if(pos.x === x && pos.y === pos.y && pos.z === z) {
      return;
    }

    super.setPosition(x, y, z);

    this.cube.position.set(x, y, z);
    this.refreshFragment();
  }

  setHeight(height) {
    this.height = height;
    this.cube.scale.y = height;
    this.updateYPosition();
    this.refreshFragment();
  }

  //this value is used to store the information of the layer of this layer
  // -----   layer 3
  // -----   layer 2
  // -----   layer 1
  // -----   layer 0 (bottom layer)
  setLayerIndex(index) {
    this.layerIndex = index;
    this.updateYPosition();
    this.refreshFragment();
  }

  updateYPosition() {
    this.position.y = this.layerIndex * this.height;
  }

  refreshFragment() {
    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    const scene = this.scene;
    const position = this.getPosition();
    const pcm = this.geometryProvider.contentProvider;
    const scm = pcm.contentProvider;

    pcm.position = {
      x: position.x - 0.5,
      y: position.y,
      z: position.z + 0.5
    };
    scm.scale = {x: 0.9, y: this.height * 0.95, z: 0.9};

    this.geometryProvider.color = new THREE.Color(theme.map.colors.layer);

    const fragment = this.fragment = {
      id: this.id,
      contentProvider: this.geometryProvider
    };

    //adding a existing fragment will penetrate an update
    scene.layerSingleMeshFactory.addFragment(fragment);
    scene.renderScene();
  }

  dispose() {
    super.dispose();

    this.highlighting.dispose();

    this.removeCollisionObject();
    this.removeFromGlobalGeometry();

    this.snapshot = null;
  }
}
