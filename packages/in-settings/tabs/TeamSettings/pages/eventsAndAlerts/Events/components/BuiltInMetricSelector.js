import React from 'react';

import { getAllBuiltInMetrics } from 'in-sdk/metrics';
import ComboBox from 'in-components/ComboBox';

import locals from './BuiltInMetricSelector.mless';

export default function BuiltInMetricSelector({ id, plugin, onChange, value, clearable = true }) {
  const metricsList = getAllBuiltInMetrics(plugin);
  return (
    <ComboBox
      name={id}
      value={value}
      options={limitMetricDefinitionItemWidth(metricsList)}
      onChange={onChange}
      clearable={clearable}
    />
  );
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
