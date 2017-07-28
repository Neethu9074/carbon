import React from 'react';

import { formatDurationAccurately } from 'in-services/formatters/date';
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

    let left = config.y1.isDynamicAggregated ? 'dynamic' : 'rollup';
    let right = config.y2 ? (config.y2.isDynamicAggregated ? 'dynamic' : 'rollup') : null;

    if (left === right) {
      right = null;
    } else if (__DEV__) {
      throw new Error(
        'One axis is aggregated while the other is not. This is likely to confuse the user. Please use an aggregation for both axis.'
      );
    }

    return (
      <div className={block}>
        <Aggregation type={left} config={config} axis={config.y1} />
        <Aggregation type={right} config={config} axis={config.y2} />
      </div>
    );
  }
);

function Aggregation({ type, config, axis }) {
  if (!type) {
    return null;
  }
  if (type === 'dynamic') {
    return (
      <div className={block}>
        Rollup {formatDurationAccurately(axis.dynamicCalculatedBlockSizeMillis, 0)}
      </div>
    );
  }
  if (type === 'rollup') {
    return (
      <div className={block}>
        Rollup {config.rollup.label}
      </div>
    );
  }
}
