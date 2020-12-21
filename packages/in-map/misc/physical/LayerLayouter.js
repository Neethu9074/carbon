import { combineLatest } from '@instana/observables';

import PCP from 'in-map/singleMeshFactories/ContentProvider/PointContentProvider';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import { LAYER_LAYOUTING } from 'in-map/misc/TimingConfig';
import { getFactory } from 'in-map/stores/factoriesStore';

const LAYER_MARGIN = 0.9; // 90%
const LAYER_MARGIN_OF_LAST_NODE = 0.99; // 99%

export default function createLayouter(node) {
  const fragments = [];
  const factory = getFactory('icons');

  const layerSubscription = combineLatest([node.eventEmitter.on('transformationChanged'), node.layer.stream])
    .debounce(LAYER_LAYOUTING)
    .subscribe(([nodeTransform, _layer]) => {
      const plugins = applyLayout(nodeTransform, _layer);
      if (plugins) {
        setupPluginIcons(plugins);
      } else {
        removeCurrentIcons();
      }
    });

  function applyLayout(nodeTransform, _layer) {
    // if there are no layer, just return null
    if (_layer.size === 0) {
      return null;
    }

    // special case, there is only one layer
    if (_layer.size === 1) {
      return layoutSingle(nodeTransform, _layer);
    }

    return layoutMultiple(nodeTransform, _layer);
  }

  function layoutSingle(nodeTransform, _layer) {
    const nodePosition = nodeTransform.position;
    const nodeScale = nodeTransform.scale;
    const theLayer = _layer.values().next().value;
    const nodeFullHeight = nodeScale.y;

    theLayer
      .getComponent('transform')
      .setTransformXYZ(
        nodePosition.x,
        0,
        nodePosition.z,
        nodeScale.x * LAYER_MARGIN,
        nodeFullHeight * LAYER_MARGIN_OF_LAST_NODE,
        nodeScale.z * LAYER_MARGIN
      );

    const plugins = {};
    plugins[theLayer._cachedPlugin] = {
      from: 0,
      to: nodeTransform.scale.y
    };
    return plugins;
  }

  function layoutMultiple(nodeTransform, _layer) {
    const nodePosition = nodeTransform.position;
    const nodeScale = nodeTransform.scale;
    const nodeFullHeight = nodeScale.y;
    const plugins = {};

    const layerAsArray = [];
    _layer.forEach(l => layerAsArray.push(l));

    // sort layer desc by plugin because they are layouted from bottom up
    // no need to copy the array since it is created new on every call
    layerAsArray.sort((l1, l2) => l2._cachedPlugin.localeCompare(l1._cachedPlugin));

    // - 1 : if you have only one plugin, you have zero gaps. seems legit
    const numGaps = 0.0000001 + countDifferentPluginsFromSortedArray(_layer) - 1;

    // the space between each group of layer
    const heightOfGap = nodeFullHeight / (numGaps * 10);

    // the remaining height to sliver for the layer
    const heightUsedForLayer = nodeFullHeight - numGaps * heightOfGap;
    const heightOfEachLayer = heightUsedForLayer / _layer.size;

    let currentPlugin = layerAsArray[0]._cachedPlugin;
    plugins[currentPlugin] = {
      from: 0,
      to: nodeFullHeight
    };
    let currentYPosition = 0;
    let lastYPositionBeforePluginChanged = 0;

    for (let i = 0, length = layerAsArray.length; i < length; i++) {
      const layer = layerAsArray[i];
      const plugin = layer._cachedPlugin;

      if (plugin !== currentPlugin) {
        plugins[currentPlugin].to = currentYPosition;

        currentPlugin = plugin;
        lastYPositionBeforePluginChanged = currentYPosition;

        plugins[currentPlugin] = {
          from: lastYPositionBeforePluginChanged,
          to: nodeFullHeight
        };

        currentYPosition += heightOfGap;
      }

      const heightOfLayer =
        i === _layer.length - 1 ? heightOfEachLayer * LAYER_MARGIN_OF_LAST_NODE : heightOfEachLayer * LAYER_MARGIN;

      const transform = layer.getComponent('transform');
      transform.setTransformXYZ(
        nodePosition.x,
        currentYPosition,
        nodePosition.z,
        nodeScale.x * LAYER_MARGIN,
        heightOfLayer,
        nodeScale.z * LAYER_MARGIN
      );

      currentYPosition += heightOfEachLayer;
    }

    return plugins;
  }

  function countDifferentPluginsFromSortedArray(_layer) {
    const plugins = {};
    _layer.forEach(layer => (plugins[layer._cachedPlugin] = true));
    return Object.keys(plugins).length;
  }

  function setupPluginIcons(plugins) {
    removeCurrentIcons();

    Object.keys(plugins).forEach(key => {
      const icon = plugins[key];
      const fragment = createFragment(node.id + '_' + key, node, PCP, {
        positionOffset: {
          x: 0.6,
          y: icon.from + (icon.to - icon.from) / 2, // place in the middle
          z: 0.6
        },
        type: key,
        iconSize: 1
      });
      factory.add(fragment);
      fragments.push(fragment);
    });
    factory.needsUpdate();
  }

  function removeCurrentIcons() {
    for (let i = 0, length = fragments.length; i < length; i++) {
      factory.remove(fragments[i].id);
    }
    factory.needsUpdate();
  }

  function dispose() {
    layerSubscription.dispose();

    removeCurrentIcons();
  }

  return {
    dispose,

    // export them to make them testable
    countDifferentPluginsFromSortedArray
  };
}
