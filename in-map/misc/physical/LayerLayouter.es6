import {combineLatest} from 'reactive-observables';


const LAYER_MARGIN = 0.9; // 90%

export default function createLayouter(node) {
  const layerSubscription = combineLatest([
    node.eventEmitter.on('positionChanged'),
    node.eventEmitter.on('scaleChanged'),
    node.layer.stream
  ]).debounce(100)
    .subscribe(([nodePosition, nodeScale, _layer]) =>
      applyLayout(nodePosition, nodeScale, Object.keys(_layer.objects).map(key => _layer.objects[key])));

  function applyLayout(nodePosition, nodeScale, _layer) {
    const numLayer = _layer.length;
    if (numLayer === 0) {
      return;
    }

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

    refreshIcons(plugins);
  }

  function refreshIcons(plugins) {
    console.log(plugins);
  }

  function dispose() {
    layerSubscription.dispose();
  }

  return {
    dispose
  };
}
