import React from 'react';

import ResultAwareKpiCard from 'in-new-components/KpiCard/ResultAwareKpiCard';
import getMetrics from 'in-subscription/application/getMetrics';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getMetrics(props.metricsConfig)
  }),
  function AppDataKpiCard({ title, result, metricsConfig, formatter }) {
    return (
      <ResultAwareKpiCard
        title={title}
        result={result}
        renderKpiCard={result => {
          const metricName = Object.keys(metricsConfig.metrics)[0];
          let value = null;
          if (result.data[metricName] && result.data[metricName].length === 1) {
            value = result.data[metricName][0][1];
          }

          if (value != null) {
            value = formatter(value);
          }

          return <KpiCard title={title} value={value} />;
        }}
      />
    );
  }
);
