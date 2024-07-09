/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import presentationPresets from 'in-amp/components/presentationPresets';
import usageTimePresets from 'in-amp/components/usageTimePresets';
import DropdownButton from 'in-components/Button/DropdownButton';
import timePresets from 'in-amp/components/timePresets';

export default function TimeSelection({
  windowSize,
  timeRange,
  setWindowSize,
  setTimeRange,
  setTo,
  presentation,
  setPresentation
}) {
  if (timeRange) {
    const options = usageTimePresets.map(p => ({ value: p, label: p.label }));
    const currentPresentation = presentationPresets.find(preset => preset.presentation === presentation);

    return (
      <ComboBoxBehavior
        align="bottomRight"
        value={options.find(({ value }) => value.timeRange === timeRange)?.value}
        options={options}
        onChange={({ timeRange, windowSize, to }) => {
          setTimeRange?.(timeRange);
          setWindowSize?.(windowSize);
          setTo?.(to);
          if (currentPresentation?.isDisabled(timeRange)) {
            setPresentation?.('distinct');
          }
        }}
        disableAutomaticOptionSorting
      >
        {({ elementProps, isOpen }) => (
          <DropdownButton {...elementProps} kind="secondary" expanded={isOpen}>
            {options.find(({ value }) => value.timeRange === timeRange)?.value.label}
          </DropdownButton>
        )}
      </ComboBoxBehavior>
    );
  } else {
    const options = timePresets.map(p => ({ value: p, label: p.label }));

    return (
      <ComboBoxBehavior
        align="bottomRight"
        value={options.find(({ value }) => value.windowSize === windowSize)?.value}
        options={options}
        onChange={({ windowSize }) => {
          setWindowSize?.(windowSize);
        }}
        disableAutomaticOptionSorting
      >
        {({ elementProps, isOpen }) => (
          <DropdownButton {...elementProps} kind="secondary" expanded={isOpen}>
            {options.find(({ value }) => value.windowSize === windowSize)?.value.label}
          </DropdownButton>
        )}
      </ComboBoxBehavior>
    );
  }
}
