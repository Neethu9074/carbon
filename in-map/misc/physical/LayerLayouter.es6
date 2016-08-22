import {combineLatest} from 'reactive-observables';

import PCP from 'in-map/singleMeshFactories/ContentProvider/PointContentProvider';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import {LAYER_LAYOUTING} from 'in-map/misc/TimingConfig';

import {getFactory} from 'in-map/stores/factoriesStore';


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

    // sort layer desc by plugin because they are layouted from bottom to top
    _layer = _layer.sort((l1, l2) => l2._cachedPlugin.localeCompare(l1._cachedPlugin));

    const plugins = {};
    let currentPlugin = undefined;
    const heightOfEachLayer = nodeScale.y / numLayer;
    for (let i = 0, length = _layer.length; i < length; i++) {
      const layer = _layer[i];
      const plugin = layer._cachedPlugin;
      if (plugin !== currentPlugin) {
        if (plugins[currentPlugin]) {
          plugins[currentPlugin].to = i * heightOfEachLayer;
        }
        currentPlugin = plugin;
        plugins[plugin] = {
          layer,
          from: i * heightOfEachLayer,
          to: nodeScale.y
        };
      }

      const heightOfLayer = heightOfEachLayer - Math.min(0.1, heightOfEachLayer * LAYER_MARGIN);
      const transform = layer.getComponent('transform');
      transform.setScaleXYZ(LAYER_MARGIN,
                            heightOfLayer,
                            LAYER_MARGIN);

      transform.setPositionXYZ(nodePosition.x,
                               i * heightOfEachLayer,
                               nodePosition.z);
    }

    setupPluginIcons(plugins);
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
