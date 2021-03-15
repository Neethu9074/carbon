/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import { syntheticCallsOptions } from 'in-applications/constants';

import locals from './IncludeSyntheticCallsDropdown.mless';

export default function IncludeSyntheticCallsDropdown(props) {
  const { syntheticCalls: urlSyntheticCallsOption, disabled, onSyntheticCallsStateChange } = props;
  const selectedOption = urlSyntheticCallsOption || syntheticCallsOptions.default;
  const syntheticCallsOptionLabel = syntheticCallsOptions.info[selectedOption].label;

  return (
    <ComboBoxBehavior
      value={selectedOption}
      options={[
        { value: syntheticCallsOptions.exclude, label: renderItemContent(syntheticCallsOptions.exclude) },
        { value: syntheticCallsOptions.include, label: renderItemContent(syntheticCallsOptions.include) }
      ]}
      onChange={value => onSyntheticCallsStateChange({ syntheticCalls: value })}
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} expanded={isOpen} kind="secondary" disabled={disabled}>
          <div className={locals.buttonContent}>Synthetic Calls: {syntheticCallsOptionLabel}</div>
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

function renderItemContent(item) {
  const { label, description } = syntheticCallsOptions.info[item];
  return (
    <div className={locals.option}>
      <div className={locals.label}>{label}</div>
      <div className={locals.description}>{description}</div>
    </div>
  );
}
