/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
      options={metricsList}
      optionRenderer={renderOption}
      onChange={onChange}
      clearable={clearable}
    />
  );
}

function renderOption(option) {
  return (
    <div className={locals.item}>
      {option.label}
      <span className={locals.subtleMetric}>({option.metricLabel})</span>
    </div>
  );
}
