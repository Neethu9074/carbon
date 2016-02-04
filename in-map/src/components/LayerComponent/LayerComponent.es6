import _ from 'lodash';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import PluginLabel from '../../SceneObjects/Label/PluginLabel';
import Layer from '../../SceneObjects/Layer';
import Component from '../Component';
import XYZ from '../XYZ';


const maxPercentUsedByGaps = 10;

export default class LayerComponent extends Component {
  constructor({sceneObject}) {
    super(sceneObject, '_layer');

    this.positionToSet = new XYZ(-1000, 0, 0);
    this.heightToSet = 1;
    this.layerGroupLabel = [];
    this.layer = [];

    this.initialized();
  }

  onInitialEnter() {
    this.setActiveStateForLayer(true);
  }

  onInactiveEnter() {
    this.setActiveStateForLayer(false);
  }


  addLayer(presentLayer) {
    presentLayer.forEach(entity => {
      const layerId = entity.get('id');

      // don't create a layer if its still there
      const match = _.find(this.layer, layer => layer.id === layerId);

      if (!match) {
        this.layer.push(new Layer({parent: this, entity}));
        this.needsUpdate = true;
      }
    });

    if (!this.isActive()) {
      this.setActiveStateForLayer(false);
    }
  }

  removedVanishedLayer(presentLayer) {
    const removedLayer = [];

    this.layer.forEach(layer => {
      const layerId = layer.id;

      // find layer which are not sended anymore, so vanished
      let found = false;

      for (let i = 0; i < presentLayer.size; i++) {
        const coordId = presentLayer.get([i, 'id']);
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
      layer.dispose();
    });
  }

  positionChanged(x, y, z) {
    this.positionToSet.set(x, y, z);
    this.needsUpdate = true;
  }

  heightChanged(newHeight) {
    const height = this.heightToSet;
    if (height === newHeight) {
      return;
    }

    this.heightToSet = newHeight;
    this.needsUpdate = true;
  }

  update() {
    this.arrangeChildren();

    const pos = this.positionToSet;
    this.layerGroupLabel.forEach(label => {
      const positionComponent = label.getComponent('position');
      const oldYPos = positionComponent.position.y;
      positionComponent.setPosition(pos.x, oldYPos, pos.z + 1);
    });

    this.needsUpdate = false;
  }

  arrangeChildren() {
    const layer = this.getSortedLayer();
    const transformations = this.getLayerTransformations();

    layer.forEach((child, index) => {
      const transformation = transformations[index];
      const position = transformation.position;
      const positionComponent = child.getComponent('position');

      child.setHeight(transformation.heightOfSlice);
      positionComponent.setPosition(position.x, position.y, position.z);
    });

    this.addLabels(layer, transformations);
  }

  addLabels(layer, transformations) {
    this.layerGroupLabel.forEach(l => l.dispose());
    this.layerGroupLabel = [];

    const addLabelForChild = (child, y) => {
      const label = new PluginLabel({
        id: child.id,
        parent: child
      });
      label.getComponent('position').setPosition(0, y, 0);

      this.layerGroupLabel.push(label);
    };

    for (let i = 0; i < layer.length; i++) {
      const currentLayer = layer[i];
      const from = transformations[i].position.y;

      i = this.getNextGroupIndex(layer, i);

      if (i >= layer.length) {
        i = layer.length - 1;
      }

      const to = transformations[i].position.y + transformations[i].heightOfSlice;
      addLabelForChild(currentLayer, (from + to) / 2);
    }
  }

  getNextGroupIndex(array, startIndex) {
    for (let i = startIndex; i <= array.length; i++) {
      const item = array[i];
      const nextItem = array[i + 1];

      if (!nextItem) {
        break;
      }
      if (item.type !== nextItem.type) {
        return i;
      }
    }
    return array.length;
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
      if (prevChild && child.type !== prevChild.type) {
        position += gapHeight;
      }

      transformations[index] = {
        position: {x: pos.x, y: position, z: pos.z },
        heightOfSlice: heightOfEachChild * 0.9
      };

      position += heightOfEachChild;
      prevChild = child;
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
      if (array[i].type !== array[i - 1].type) {
        differentTypes++;
      }
    }

    return differentTypes;
  }

  getSortedLayer() {
    // reverse the sort order to get aligned with tooltip
    return this.layer.sort((a, b) => b.type.localeCompare(a.type));
  }

  setActiveStateForLayer(active) {
    const isActive = active ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.layer.forEach(layer => layer.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, isActive));
    this.layerGroupLabel.forEach(label => label.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, isActive));
  }

  // is called if a layer was disposed
  removeChild(toBeRemoved) {
    _.remove(this.layer, layer => toBeRemoved.id === layer.id);
    this.needsUpdate = true;
  }

  dispose() {
    super.dispose();

    this.layer.slice().forEach(layer => layer.dispose());
    this.layerGroupLabel.forEach(label => label.dispose());

    this.positionToSet.dispose();

    this.positionToSet = null;
    this.heightToSet = null;
    this.layer = null;
  }
}
