import React from 'react';

import { getAllBuiltInMetrics } from 'in-sdk/metrics';
import ComboBox from 'in-components/ComboBox';

import locals from './BuiltInMetricSelector.mless';

export default function BuiltInMetricSelector({ id, plugin, onChange, value, clearable = true }) {
  const metricsList = getAllBuiltInMetrics(plugin);
  return (
    <ComboBox name={id} value={value} options={formatItem(metricsList)} onChange={onChange} clearable={clearable} />
  );
}

function formatItem(metricsList) {
  return metricsList.map(metricDef => {
    metricDef.origLabel = metricDef.label;
    metricDef.label = (
      <div className={locals.item}>
        {metricDef.label}
        <span className={locals.subtleMetric}>({metricDef.metricLabel})</span>
      </div>
    );
    return metricDef;
  });
}
