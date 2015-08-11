import _ from 'lodash';

import {isIdEqual} from 'in-services/util/snapshots';

import Layer from '../../sceneObjects/Layer/index';
import Component from '../Component';


export default class LayerComponent extends Component {
  constructor({sceneObject}) {
    super(sceneObject);

    this.positionToSet = {x: -1000, y: 0, z: 0};
    this.heightToSet = 1;
    this.layer = [];

    this.initialized();
  }

  onInitialEnter() {
    this.layer.forEach(layer => layer.stateMachine.changeStateProperty('active', true));
  }

  onInactiveEnter() {
    this.layer.forEach(layer => layer.stateMachine.changeStateProperty('active', false));
  }


  addLayer(snapshot) {
    //don't create a layer if its still there
    const match = _.find(this.layer, layer => isIdEqual(layer.snapshot, snapshot));

    if(match) {
      match.updateSnapshot(snapshot);
    } else {
      const newLayer = new Layer({parent: this, snapshot});
      newLayer.setLayerIndex(this.layer.indexOf(layer => isIdEqual(layer.snapshot, snapshot)));

      this.layer.push(newLayer);
      this.needsUpdate = true;
    }
  }

  positionChanged(x, y, z) {
    this.positionToSet.x = x;
    this.positionToSet.y = y;
    this.positionToSet.z = z;

    this.needsUpdate = true;
  }

  heightChanged(newHeight) {
    const height = this.heightToSet;
    if(height === newHeight) {
      return;
    }

    this.heightToSet = newHeight;
    this.needsUpdate = true;
  }

  update() {
    this.arrangeChildren();
    this.needsUpdate = false;
  }

  arrangeChildren() {
    const layer = this.layer;
    const height = this.heightToSet;
    const pos = this.positionToSet;
    const heightOfEachChild = height / layer.length;

    layer.forEach((child, index) => {
      child.setHeight(heightOfEachChild * 0.9);
      const positionComponent = child.getComponent('position');
      positionComponent.setPosition(pos.x, index * heightOfEachChild, pos.z);
    });
  }

  //is called if a layer was disposed
  removeChild(toBeRemoved) {
    _.remove(this.layer, layer => isIdEqual(toBeRemoved.snapshot, layer.snapshot));
    this.needsUpdate = true;
  }

  dispose() {
    super.dispose();

    this.layer.forEach(layer => layer.dispose());
    this.layer = [];
  }
}
