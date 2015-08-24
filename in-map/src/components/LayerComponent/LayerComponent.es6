import _ from 'lodash';

import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import Layer from '../../sceneObjects/Layer';
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
    this.layer.forEach(layer => layer.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON));
  }

  onInactiveEnter() {
    this.layer.forEach(layer => layer.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF));
  }


  addLayer(coordinates) {
    const layerId = coordinates.get('id');
    //don't create a layer if its still there
    const match = _.find(this.layer, layer => layer.id === layerId);

    if(match) {
      match.updateSnapshot(snapshot);
    } else {
      const newLayer = new Layer({parent: this, coordinates, id: layerId});
      this.layer.push(newLayer);
      this.layer.forEach((layer, index) => layer.index = index);

      if(!this.isActive()) {
        newLayer.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
      }

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
    _.remove(this.layer, layer => toBeRemoved.id === layer.id);
    this.needsUpdate = true;
  }

  dispose() {
    super.dispose();

    this.layer.slice().forEach(layer => layer.dispose());

    this.positionToSet = null;
    this.heightToSet = null;
    this.layer = null;
  }
}
