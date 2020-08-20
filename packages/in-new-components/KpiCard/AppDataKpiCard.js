import React from 'react';

import ResultAwareKpiCard from 'in-new-components/KpiCard/ResultAwareKpiCard';
import getMetrics from 'in-subscription/application/getMetrics';
import { pendingResult } from 'in-services/fixedObjects';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import useObservable from 'in-hooks/useObservable';

export default function AppDataKpiCard({ title, metricsConfig, formatter, companionFormatter, iconAction }) {
  const result = useObservable(getMetrics(metricsConfig), [metricsConfig]) ?? pendingResult;
  return (
    <ResultAwareKpiCard
      title={title}
      result={result}
      renderKpiCard={result => {
        const value = getMetricValue(result, metricsConfig, 0, formatter);
        const companionValue = getMetricValue(result, metricsConfig, 1, companionFormatter);
        return <KpiCard title={title} value={value} companionValue={companionValue} iconAction={iconAction} />;
      }}
    />
  );
}

function getMetricValue(result, metricsConfig, metricNum, formatter) {
  const metrics = Object.keys(metricsConfig.metrics);
  let value = null;
  if (metricNum < metrics.length) {
    const metricName = metrics[metricNum];
    if (result.data[metricName] && result.data[metricName].length === 1) {
      value = result.data[metricName][0][1];
    }
    if (value != null) {
      value = formatter(value);
    }
  }
  return value;
}
