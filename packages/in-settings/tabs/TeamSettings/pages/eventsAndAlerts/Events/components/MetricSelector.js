import React from 'react';

import { getPlainMetricList } from 'in-sdk/metrics';
import ComboBox from 'in-components/ComboBox';

import locals from './MetricSelector.mless';

export default function MetricSelector({ id, plugin, onChange, value, metrics }) {
  const metricsList = Array.isArray(metrics) ? metrics.slice() : getPlainMetricList(plugin);

  return <ComboBox name={id} value={value} options={limitMetricDefinitionItemWidth(metricsList)} onChange={onChange} />;
}

function limitMetricDefinitionItemWidth(metricsList) {
  return metricsList.map(metricDef => {
    if (metricDef.origLabel) {
      // ensure this item was not already wrapped
      return metricDef;
    }
    metricDef.origLabel = metricDef.label;
    metricDef.label = <span className={locals.item}>{metricDef.label}</span>;
    return metricDef;
  });
}
