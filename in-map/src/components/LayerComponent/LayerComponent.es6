import _ from 'lodash';

import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import Layer from '../../sceneObjects/Layer';
import Component from '../Component';


const maxPercentUsedByGaps = 10;

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

  removedVanishedLayer(coordinates) {
    const removedLayer = [];

    this.layer.forEach(layer => {
      const layerId = layer.id;

      // find layer which are not sended anymore, so vanished
      let found = false;

      for (let i = 0; i < coordinates.length; i++) {
        const coords = coordinates[i];
        const coordId = coords.get('id');
        if (coordId === layerId) {
          found = true;
          break;
        }
      }

      if (!found) {
        removedLayer.push(layer);
      }
    });

    removedLayer.forEach(layer => {
      this.removeChild(layer);
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
    const layer = this.layer;
    const nodeHeight = this.heightToSet;
    const numGaps = this.countDifferentTypesFromSortedArray(layer) - 1;
    const gapHeight = this.calculateHeightForEachGap(nodeHeight, numGaps);
    const heightUsedForLayer = nodeHeight - numGaps * gapHeight;

    const pos = this.positionToSet;
    const heightOfEachChild = heightUsedForLayer / layer.length;
    const transformations = [];
    let prevChild = undefined;
    let position = 0;

    layer.forEach((child, index) => {
      if (prevChild && child.label !== prevChild.label) {
        position += gapHeight;
      }
      prevChild = child;

      transformations[index] = {
        position: {x: pos.x, y: position, z: pos.z },
        heightOfSlice: heightOfEachChild * 0.9
      };

      position += heightOfEachChild;
    });

    return transformations;
  }

  calculateHeightForEachGap(heightOfNode, numGaps) {
    // if 10% is the maximum of height used for gaps -> the maximum height for
    // gaps can be 1 / 10(%) = 0.1. happens if there is only one gap, taking 10%.
    // if there are more gaps, e.g. 4 -> each one takes 10% / 4 which is
    // heightOfNode / (#Gaps * 1 / 10).
    return Math.min(1 / maxPercentUsedByGaps, heightOfNode / (numGaps * maxPercentUsedByGaps));
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
