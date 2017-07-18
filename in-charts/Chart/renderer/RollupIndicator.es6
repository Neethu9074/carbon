import React from 'react';

import connectTo from 'in-hoc/connectTo';

import './RollupIndicator.less';

const block = 'in-chart-rollup-indicator';

export default connectTo(
  props => {
    return {
      redraw: props.config.signals.restartRendering$
    };
  },
  function RollupIndicator({ config }) {
    if (!config.rollup) {
      return null;
    }

    if (config.useDynamicRollup && __DEV__) {
      return (
        <div className={block}>
          Rollup {config.dynamicRollupMultiplier} x {config.rollup.label}
        </div>
      );
    }

    return (
      <div className={block}>
        Rollup {config.rollup.label}
      </div>
    );
  }
);
