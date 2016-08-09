import {combineLatest} from 'reactive-observables';

import PCP from 'in-map/singleMeshFactories/ContentProvider/PointContentProvider';
import createFragment from 'in-map/singleMeshFactories/Fragment';

import {getFactory} from 'in-map/stores/factoriesStore';


const LAYER_MARGIN = 0.9; // 90%

export default function createLayouter(node) {
  const fragments = [];
  const factory = getFactory('icons');

  const layerSubscription = combineLatest([
    node.eventEmitter.on('positionChanged'),
    node.eventEmitter.on('scaleChanged'),
    node.layer.stream
  ]).debounce(100)
    .subscribe(([nodePosition, nodeScale, _layer]) =>
      applyLayout(nodePosition, nodeScale, Object.keys(_layer.objects).map(key => _layer.objects[key])));

  function applyLayout(nodePosition, nodeScale, _layer) {
    const numLayer = _layer.length;

    // sort layer desc by plugin because they are layouted from bottom to top
    _layer = _layer.sort((l1, l2) => l2._cachedPlugin.localeCompare(l1._cachedPlugin));

    const plugins = {};
    let currentPlugin = undefined;
    const highOfEachLayer = nodeScale.y / numLayer;
    for (let i = 0, length = _layer.length; i < length; i++) {
      const layer = _layer[i];
      const plugin = layer._cachedPlugin;
      if (plugin !== currentPlugin) {
        if (plugins[currentPlugin]) {
          plugins[currentPlugin].to = i * highOfEachLayer;
        }
        currentPlugin = plugin;
        plugins[plugin] = {
          layer,
          from: i * highOfEachLayer,
          to: nodeScale.y
        };
      }
      const transform = layer.getComponent('transform');
      if (transform) {
        transform.setScaleXYZ(LAYER_MARGIN,
                              highOfEachLayer * LAYER_MARGIN,
                              LAYER_MARGIN);

        transform.setPositionXYZ(nodePosition.x,
                                 i * highOfEachLayer,
                                 nodePosition.z);
      }
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
