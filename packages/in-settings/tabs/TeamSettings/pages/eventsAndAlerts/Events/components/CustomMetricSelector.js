/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import ComboBox from 'in-components/ComboBox/ComboBox';

export default function CustomMetricSelector({ onChange, value, metrics, disabled }) {
  const metricsList = Array.isArray(metrics) ? metrics.slice() : [];
  const parentItemForValue = metricsList.find(it => it.value === value);

  return (
    <AutoComplete
      disabled={disabled}
      value={value}
      resultsToShow={100}
      options={metricsList}
      onChange={onChange}
      item={parentItemForValue}
    />
  );
}

CustomMetricSelector.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const AutoComplete = ({ options, resultsToShow, placeholder, onChange, item, value, disabled }) => {
  return (
    <ComboBox
      itemToString={item => (item ? item.label : '')}
      onChange={onChange}
      initialelectedItem={item}
      value={value}
      isSearchable
      isClearable
      options={options.slice(0, resultsToShow)}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};
