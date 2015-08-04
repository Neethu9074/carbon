'use strict';

import THREE from 'three';

//components
import CollisionComponent from '../../components/CollisionObjectComponent';

import SceneObject from '../SceneObject/index';
import {cubeGeometry, defaultGeometryMaterial} from '../geometries';
import {currentTooltip} from '../../stores/mapStore';
import Tooltip from '../Tooltips/Layer';

import CCP from '../../SingleMeshFactory/ContentProvider/CubeContentProvider';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';

import {theme} from 'in-services/theme';
import {getIdString} from 'in-services/util/snapshots';


export default class Layer extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent, id: getIdString(snapshot)});

    this.snapshot = snapshot;
    this.layerIndex = 0; //see this.setLayerIndex

    this.geometryProvider = new CMCM({
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new CCP()
        })
      })
    });
    this.getComponent('position').setPosition(Infinity, 0, 0);

    this.tooltip = new Tooltip(this);
    this.render();
  }

  onHighlightEnter() {
    currentTooltip.emit(this.tooltip);
    this.highlighting.setHighlight();
  }

  onHighlightLeave() {
    this.highlighting.clearHighlight();
  }

  onInactiveEnter() {
    super.onInactiveEnter();
    this.scene.layerSingleMeshFactory.removeFragment(this.id);
  }

  onInactiveLeave() {
    super.onInactiveLeave();
    this.scene.layerSingleMeshFactory.addFragment(this.fragment);
  }

  onHiddenEnter() {
    super.onHiddenEnter();
    this.scene.layerSingleMeshFactory.removeFragment(this.id);
  }

  onHiddenLeave() {
    super.onHiddenLeave();
    this.scene.layerSingleMeshFactory.addFragment(this.fragment);
  }


  initComponents() {
    super.initComponents();
    this.components.collision = new CollisionComponent({
      sceneObject: this,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 1
    });
  }

  render() {
    this.refreshFragment();
  }

  removeFromGlobalGeometry() {
    this.scene.layerSingleMeshFactory.removeFragment(this.id);
  }

  updateSnapshot(snapshot) {
    this.snapshot = snapshot;
  }

  positionChanged(x, y, z) {
    this.getComponent('collision').positionChanged(x, y, z);
    this.refreshFragment();
  }

  setHeight(height) {
    this.height = height;
    this.getComponent('collision').sizeChanged(1, height, 1);
    this.refreshFragment();
  }

  //this value is used to store the information of the layer of this layer
  // -----   layer 3
  // -----   layer 2
  // -----   layer 1
  // -----   layer 0 (bottom layer)
  setLayerIndex(index) {
    this.layerIndex = index;
    this.refreshFragment();
  }

  refreshFragment() {
    const scene = this.scene;
    const position = this.getComponent('position').getPosition();
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
    this.removeFromGlobalGeometry();

    this.snapshot = null;
  }
}
