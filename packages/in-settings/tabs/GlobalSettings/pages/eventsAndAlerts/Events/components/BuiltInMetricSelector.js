/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { carbonComboBoxEnabled } from 'in-services/featureFlags';
import { getAllBuiltInMetrics } from 'in-sdk/metrics';
import ComboBox from 'in-components/ComboBox';

import locals from './BuiltInMetricSelector.mless';

export default function BuiltInMetricSelector({ id, plugin, onChange, value, isClearable = true, disabled }) {
  const metricsList = getAllBuiltInMetrics(plugin);

  return (
    <ComboBox
      isDisabled={disabled}
      name={id}
      value={value}
      options={metricsList}
      components={{ Option }}
      onChange={onChange}
      isClearable={isClearable}
    />
  );
}

function Option(props) {
  const { data: option, innerProps } = props;
  const selectedOption = props.getValue();
  return (
    <div
      className={classNames(locals.item, {
        [locals.padding]: !carbonComboBoxEnabled,
        [locals.selected]: option.value === selectedOption?.[0]?.value
      })}
      {...innerProps}
    >
      {option.label}
      <span className={locals.subtleMetric}>({option.metricLabel})</span>
    </div>
  );
}
