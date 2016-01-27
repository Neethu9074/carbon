import THREE from 'three';

import {theme} from 'in-services/theme';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import Component from '../Component';
import XYZ from '../XYZ';
import RGB from '../RGB';

import CMCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import PCP from '../../SingleMeshFactory/ContentProvider/PlaneContentProvider';

export default class GroundHighlightingComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject, '_ground_highlighting');

    this.positionToSet = new XYZ(-10, 0, 0);
    this.scaleToSet = new XYZ(1, 1, 1);
    const color = new THREE.Color(theme.map.colors.default);
    this.colorToSet = new RGB(color.r, color.g, color.b);

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
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    this.show();
  }

  onInactiveEnter() {
    this.hide();
  }


  positionChanged(x, y, z) {
    this.positionToSet.set(x, y, z);
    this.needsUpdate = true;
  }

  sizeChanged(x, y, z) {
    const scale = this.scaleToSet;
    if (scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    this.scaleToSet.set(x, y, z);
    this.needsUpdate = true;
  }

  colorChanged(r, g, b) {
    const color = this.colorToSet;
    if (color.r === r && color.g === g && color.b === b) {
      return;
    }

    this.colorToSet.set(r, g, b);
    this.needsUpdate = true;
  }

  update() {
    const cmcm = this.fragment.contentProvider;
    const pcm = cmcm.contentProvider;
    const scm = pcm.contentProvider;
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    const color = this.colorToSet;

    this.changeXYZOf(pcm.position, pos.x, pos.y, pos.z);
    this.changeXYZOf(scm.scale, scale.x, scale.y, scale.z);

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

    this.positionToSet.dispose();
    this.scaleToSet.dispose();
    this.colorToSet.dispose();

    this.positionToSet = null;
    this.scaleToSet = null;
    this.fragment = null;
  }
}
