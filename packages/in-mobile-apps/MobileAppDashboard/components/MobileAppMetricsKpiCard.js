/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import ResultAwareKpiCard from 'in-components/KpiCard/ResultAwareKpiCard';
import KpiCard from 'in-components/KpiCard/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: getMobileAppMetrics(props.metricsConfig)
  }),
  function MobileAppMetricsKpiCard({ title, result, metricsConfig, formatter, iconAction }) {
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

          return <KpiCard title={title} value={value} iconAction={iconAction} />;
        }}
      />
    );
  }
);
