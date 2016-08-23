import {combineLatest} from 'reactive-observables';

import PCP from 'in-map/singleMeshFactories/ContentProvider/PointContentProvider';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import {LAYER_LAYOUTING} from 'in-map/misc/TimingConfig';

import {getFactory} from 'in-map/stores/factoriesStore';


const maxPercentUsedByGaps = 10;
const LAYER_MARGIN = 0.9; // 90%

export default function createLayouter(node) {
  const fragments = [];
  const factory = getFactory('icons');

  const layerSubscription = combineLatest([node.eventEmitter.on('positionChanged'),
                                           node.eventEmitter.on('scaleChanged'),
                                           node.layer.stream])
                            .debounce(LAYER_LAYOUTING)
                            .subscribe(([nodePosition, nodeScale, _layer]) =>
                              applyLayout(nodePosition,
                                          nodeScale,
                                          Object.keys(_layer).map(key => _layer[key])));

  function applyLayout(nodePosition, nodeScale, _layer) {
    const numLayer = _layer.length;
    if (numLayer === 0) {
      return;
    }

    const nodeHeight = nodeScale.y;

    // sort layer desc by plugin because they are layouted from bottom to top
    _layer = _layer.sort((l1, l2) => l2._cachedPlugin.localeCompare(l1._cachedPlugin));

    const numGaps = countDifferentPluginsFromSortedArray(_layer);
    const gapHeight = calculateHeightForEachGap(nodeHeight, numGaps);
    const heightUsedForLayer = nodeHeight - numGaps * gapHeight;
    const heightOfEachLayer = heightUsedForLayer / numLayer;
    const plugins = {};

    let firstPassed = false;
    let currentPlugin;
    let position = 0;
    for (let i = 0, length = _layer.length; i < length; i++) {
      const layer = _layer[i];
      const plugin = layer._cachedPlugin;
      if (plugin !== currentPlugin) {
        if (!firstPassed) {
          firstPassed = true;
        } else {
          position += gapHeight;
        }

        if (plugins[currentPlugin]) {
          plugins[currentPlugin].to = i * heightOfEachLayer;
        }
        currentPlugin = plugin;
        plugins[plugin] = {
          layer,
          from: position,
          to: nodeHeight
        };
      }

      const transform = layer.getComponent('transform');
      transform.setScaleXYZ(LAYER_MARGIN,
                            heightOfEachLayer - Math.min(0.1, heightOfEachLayer * LAYER_MARGIN),
                            LAYER_MARGIN);

      transform.setPositionXYZ(nodePosition.x,
                               position,
                               nodePosition.z);

      position += heightOfEachLayer;
    }

    setupPluginIcons(plugins);
  }

  function calculateHeightForEachGap(heightOfNode, numGaps) {
    // if 10% is the maximum of height used for gaps -> the maximum height for
    // gaps can be 1 / 10(%) = 0.1. happens if there is only one gap, taking 10%.
    // if there are more gaps, e.g. 4 -> each one takes 10% / 4 which is
    // heightOfNode / (#Gaps * 1 / 10).
    return Math.min(1 / maxPercentUsedByGaps, heightOfNode / (numGaps * maxPercentUsedByGaps));
  }

  function countDifferentPluginsFromSortedArray(_layer) {
    const plugins = {};

    for (let i = 1, length = _layer.length; i < length; i++) {
      plugins[_layer[i]._cachedPlugin] = true;
    }

    return Object.keys(plugins).length;
  }

  function setupPluginIcons(plugins) {
    removeCurrentIcons();

    Object.keys(plugins).forEach(key => {
      const icon = plugins[key];
      const fragment = createFragment(node.id + '_' + key,
                                      node,
                                      PCP,
                                      {
                                        positionOffset: {
                                          x: 0.6,
                                          y: icon.from + ((icon.to - icon.from) / 2), // place in the middle
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
    dispose
  };
}
