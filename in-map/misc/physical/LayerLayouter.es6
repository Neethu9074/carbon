import { combineLatest } from 'reactive-observables';

import PCP from 'in-map/singleMeshFactories/ContentProvider/PointContentProvider';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import { LAYER_LAYOUTING } from 'in-map/misc/TimingConfig';
import { getFactory } from 'in-map/stores/factoriesStore';

const LAYER_MARGIN = 0.9; // 90%

export default function createLayouter(node) {
  const fragments = [];
  const factory = getFactory('icons');

  const layerSubscription = combineLatest([node.eventEmitter.on('transformationChanged'), node.layer.stream])
    .debounce(LAYER_LAYOUTING)
    .subscribe(([nodeTransform, _layer]) => {
      const plugins = applyLayout(nodeTransform, Object.keys(_layer).map(key => _layer[key]));
      setupPluginIcons(plugins);
    });

  function applyLayout(nodeTransform, _layer) {
    const nodePosition = nodeTransform.position;
    const nodeScale = nodeTransform.scale;
    const numLayer = _layer.length;
    if (numLayer === 0) {
      return {};
    }

    const nodeFullHeight = nodeScale.y;

    // sort layer desc by plugin because they are layouted from bottom up
    // no need to copy the array since it is created new on every call
    _layer.sort((l1, l2) => l2._cachedPlugin.localeCompare(l1._cachedPlugin));

    // - 1 : if you have only one plugin, you have zero gaps. seems legit
    const numGaps = countDifferentPluginsFromSortedArray(_layer) - 1;

    // the space between each group of layer
    const heightOfGap = numGaps === 0 ? 0 : nodeFullHeight / (numGaps * 10);

    // the remaining height to sliver for the layer
    const heightUsedForLayer = nodeFullHeight - numGaps * heightOfGap;
    const heightOfEachLayer = heightUsedForLayer / numLayer;

    let currentPlugin = _layer[0]._cachedPlugin;
    const plugins = {};
    plugins[currentPlugin] = {
      from: 0,
      to: nodeFullHeight
    };
    let currentYPosition = 0;
    let lastYPositionBeforePluginChanged = 0;

    for (let i = 0, length = _layer.length; i < length; i++) {
      const layer = _layer[i];
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

      const transform = layer.getComponent('transform');
      transform.setTransformXYZ(
        nodePosition.x,
        currentYPosition,
        nodePosition.z,
        nodeScale.x * LAYER_MARGIN,
        heightOfEachLayer * LAYER_MARGIN,
        nodeScale.z * LAYER_MARGIN
      );

      currentYPosition += heightOfEachLayer;
    }

    return plugins;
  }

  function countDifferentPluginsFromSortedArray(_layer) {
    const plugins = {};
    for (let i = 0, length = _layer.length; i < length; i++) {
      plugins[_layer[i]._cachedPlugin] = true;
    }
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
