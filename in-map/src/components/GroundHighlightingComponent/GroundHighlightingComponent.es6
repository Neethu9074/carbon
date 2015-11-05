import THREE from 'three';

import {theme} from 'in-services/theme';

import Component from '../Component';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PlaneContentProvider';

export default class GroundHighlightingComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject);

    this.positionToSet = {x: -10, y: 0, z: 0};
    this.scaleToSet = {x: 1, y: 1, z: 1};
    const color = new THREE.Color(theme.map.colors.default);
    this.colorToSet = {r: color.r, g: color.g, b: color.b};

    this.fragment = {
      id: this.getID(),
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new PCP()
          })
        })
      })
    };

    this.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    this.show();
  }

  onInactiveEnter() {
    this.hide();
  }


  positionChanged(x, y, z) {
    this.changeXyzOf(this.positionToSet, x, y, z);
    this.needsUpdate = true;
  }

  sizeChanged(x, y, z) {
    const scale = this.scaleToSet;
    if (scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.changeXyzOf(this.scaleToSet, x, y, z);
    this.needsUpdate = true;
  }

  colorChanged(r, g, b) {
    const color = this.colorToSet;
    if (color.r === r && color.g === g && color.b === b) {
      return;
    }

    this.colorToSet.r = r;
    this.colorToSet.g = g;
    this.colorToSet.b = b;
    this.needsUpdate = true;
  }

  changeXyzOf(object, x, y, z) {
    object.x = x;
    object.y = y;
    object.z = z;
  }

  update() {
    const cmcm = this.fragment.contentProvider;
    const pcm = cmcm.contentProvider;
    const scm = pcm.contentProvider;
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const color = this.colorToSet;

    this.changeXyzOf(pcm.position, pos.x, pos.y, pos.z);
    this.changeXyzOf(scm.scale, scale.x, scale.y, scale.z);

    cmcm.color = color;

    this.hide();
    if (this.isActive()) {
      this.show();
    }

    this.needsUpdate = false;
  }

  show() {
    this.sceneObject.scene.groundSingleMeshFactory.addFragment(this.fragment);
  }

  hide() {
    this.sceneObject.scene.groundSingleMeshFactory.removeFragment(this.getID());
  }

  getID() {
    return this.sceneObject.id + '_highlight';
  }

  dispose() {
    super.dispose();

    this.hide();

    this.positionToSet = null;
    this.scaleToSet = null;
    this.fragment = null;
  }
}
