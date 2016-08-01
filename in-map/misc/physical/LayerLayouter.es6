import {combineLatest} from 'reactive-observables';

import layer from 'in-map/stores/physical/layer';


export default function createLayouter(node) {

  const layerSubscription = combineLatest([
    node.eventEmitter.on('positionChanged'),
    layer.objects[node.id].stream.throttle(500)
  ]).subscribe(([nodePosition, _layer]) => {
    applyLayout(nodePosition, Object.keys(_layer.objects).map(key => _layer.objects[key]));
  });

  function applyLayout(nodePosition, _layer) {
    const numLayer = _layer.length;
    if (numLayer === 0) {
      return;
    }

    const highOfEachLayer = 1 / numLayer;
    for (let i = 0, length = _layer.length; i < length; i++) {
      const item = _layer[i];
      const transform = item.getComponent('transform');
      if (transform) {
        transform.setScaleXYZ(0.9, highOfEachLayer * 0.9, 0.9);
        transform.setPositionXYZ(nodePosition.x,
                                 i * highOfEachLayer,
                                 nodePosition.z);
      }
    }
  }

  function dispose() {
    layerSubscription.dispose();
  }

  return {
    dispose
  };
}
