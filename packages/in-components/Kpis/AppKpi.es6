import React from 'react';

import getMetrics from 'in-subscription/application/getMetrics';
import connectTo from 'in-hoc/connectTo';
import AppKpiPresenter from 'in-components/Kpis/AppKpiPresenter';

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

    return (
      <AppKpiPresenter
        result={result}
        label={label}
        formatter={formatter}
        metricName={Object.keys(metricsConfig.metrics)[0]}
      />
    );
  }
);
