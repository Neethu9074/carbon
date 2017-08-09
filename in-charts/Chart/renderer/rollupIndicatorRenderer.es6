import ReactDOM from 'react-dom';
import React from 'react';

import RollupIndicator from 'in-charts/Chart/renderer/RollupIndicator';

export default function createRollupIndicator(config) {
  const subscription = config.signals.restartRendering$.subscribe(onRedraw);
  const element = config.dom.wrapper.parentNode;

  ReactDOM.render(<RollupIndicator config={config} />, config.dom.rollupIndicator);

  return {
    dispose
  };

  function dispose() {
    element.style.marginTop = null;
    element.style.position = null;
    subscription.dispose();
    ReactDOM.unmountComponentAtNode(config.dom.rollupIndicator);
  }

  function onRedraw() {
    const addAdditionalSpaceForIndicator = config.rollup != null;
    if (addAdditionalSpaceForIndicator) {
      element.style.marginTop = '25px';
      element.style.position = 'relative';
    } else {
      element.style.marginTop = null;
      element.style.position = null;
    }
  }
}
