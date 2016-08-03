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

    const highOfEachLayer = nodeScale.y / numLayer;
    for (let i = 0, length = _layer.length; i < length; i++) {
      const item = _layer[i];
      const transform = item.getComponent('transform');
      if (transform) {
        transform.setScaleXYZ(LAYER_MARGIN,
                              highOfEachLayer * LAYER_MARGIN,
                              LAYER_MARGIN);

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
