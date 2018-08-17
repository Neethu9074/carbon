import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import getMetrics from 'in-subscription/application/getMetrics';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

/**
 EXAMPLE - USAGE:

 <AppDataKpiCard
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
  function AppDataKpiCard({ title, result, metricsConfig, formatter }) {
    if (result.errors.length > 0) {
      return (
        <KpiCard title={title}>
          <ErroneousResultPresenter errors={result.errors} />
        </KpiCard>
      );
    }

    if (result.progress.loading) {
      return (
        <KpiCard title={title} withoutPadding>
          <HorizontalIndicator progress={result.progress} />
        </KpiCard>
      );
    }

    const metricName = Object.keys(metricsConfig.metrics)[0];
    let value = null;
    if (result.data[metricName] && result.data[metricName].length === 1) {
      value = result.data[metricName][0][1];
    }

    if (value != null) {
      value = formatter(value);
    }

    return <KpiCard title={title} value={value} />;
  }
);
