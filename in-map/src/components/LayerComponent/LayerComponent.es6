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
    coordinates.forEach(layerCoordinates => {
      const layerId = layerCoordinates.get('id');

      // don't create a layer if its still there
      const match = _.find(this.layer, layer => layer.id === layerId);

      if(!match) {
        const newLayer = new Layer({
          coordinates: layerCoordinates,
          parent: this,
          id: layerId
        });

        this.layer.push(newLayer);
        this.needsUpdate = true;
      }
    });
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
    const layer = this.getSortedLayer();
    const transformations = this.getLayerTransformations();

    layer.forEach((child, index) => {
      const transformation = transformations[index];
      child.setHeight(transformation.heightOfSlice);

      const position = transformation.position;
      const positionComponent = child.getComponent('position');
      positionComponent.setPosition(position.x, position.y, position.z);
    });
  }

  getLayerTransformations() {
    const pos = this.positionToSet;
    const layer = this.layer;
    const heightOfEachChild =
      this.heightToSet /
      (layer.length + (0.15 * (this.countDifferentTypesFromSortedArray(layer) - 1)));
    const transformations = [];
    let heightAddition = 0;
    let prevChild = undefined;
    let position = 0;

    layer.forEach((child, index) => {
      let heightOfSlice = heightOfEachChild - 0.1;
      if (heightOfSlice <= 0) {
        heightOfSlice = heightOfEachChild * 0.75;
      }

      if (prevChild && child.label !== prevChild.label) {
        heightAddition++;
        position += 0.15;
      }
      prevChild = child;

      transformations[index] = {
        position: {x: pos.x, y: position, z: pos.z },
        heightOfSlice
      };

      position += heightOfEachChild * 0.9;
    });

    return transformations;
  }

  countDifferentTypesFromSortedArray(array) {
    let differentTypes = 1;

    for (let i = 1; i < array.length; i++) {
      if (array[i].label !== array[i - 1].label) {
        differentTypes++;
      }
    }

    return differentTypes;
  }

  getSortedLayer() {
    return this.layer.sort((l1, l2) => l1.label <= l2.label);
  }

  // is called if a layer was disposed
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
