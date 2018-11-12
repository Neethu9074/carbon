import React from 'react';

import getWebsiteMetrics from 'in-subscription/websiteMonitoring/getWebsiteMetrics';
import ResultAwareKpiCard from 'in-new-components/KpiCard/ResultAwareKpiCard';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getWebsiteMetrics(props.metricsConfig)
  }),
  function WebsiteMetricsKpiCard({ title, result, metricsConfig, formatter }) {
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
