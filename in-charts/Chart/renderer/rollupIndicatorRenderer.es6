import ReactDOM from 'react-dom';
import React from 'react';

import RollupIndicator from 'in-charts/Chart/renderer/RollupIndicator';

export default function createRollupIndicator(config) {
  function dispose() {
    ReactDOM.unmountComponentAtNode(config.dom.rollupIndicator);
  }

  ReactDOM.render(<RollupIndicator config={config} />, config.dom.rollupIndicator);

  return {
    dispose
  };
}
