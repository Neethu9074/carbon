import React from 'react';

import getMetrics from 'in-subscription/application/getMetrics';
import connectTo from 'in-hoc/connectTo';

import locals from './Kpis.mless';

/**
 EXAMPLE - USAGE:

 <App20Kpi
   label="Latency"
   formatter={ms}
   metricsConfig={{
    filter,
    metrics: {
      latency: {
        metric: 'latency',
        aggregation: 'SUM'
      }
    }
    }}
 />

 */

export default connectTo(
  props => ({
    result: getMetrics(props.metricsConfig)
  }),
  function({ label, result, metricsConfig, formatter }) {
    //TODO: Style me
    if (result.errors.length > 0) {
      return <div>{result.errors.join(',')}</div>;
    }

    if (result.progress.loading) {
      return <div>Loading...</div>;
    }

    const key = Object.keys(metricsConfig.metrics)[0];
    const metricValue = result.data[key][0][1];
    return (
      <div className={locals.kpi}>
        <div className={locals.metric}>{formatter.detailed(metricValue)}</div>
        <div>{label}</div>
      </div>
    );
  }
);
