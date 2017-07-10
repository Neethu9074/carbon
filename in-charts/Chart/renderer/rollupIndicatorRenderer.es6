import ReactDOM from 'react-dom';
import React from 'react';

import RollupIndicator from 'in-charts/Chart/renderer/RollupIndicator';

export default function createRollupIndicator(config) {
  let redrawSubscription = config.signals.restartRendering$.subscribe(show);

  function dispose() {
    redrawSubscription.dispose();
    redrawSubscription = null;

    ReactDOM.unmountComponentAtNode(config.dom.rollupIndicator);
  }

  function show() {
    ReactDOM.render(<RollupIndicator rollup={config.rollup} />, config.dom.rollupIndicator);
  }

  return {
    dispose
  };
}
