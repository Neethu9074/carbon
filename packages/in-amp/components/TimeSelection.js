/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dropdown } from '@instana/components';

import presentationPresets from 'in-amp/components/presentationPresets';
import usageTimePresets from 'in-amp/components/usageTimePresets';
import timePresets from 'in-amp/components/timePresets';

import locals from './TimeSelection.mless';

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
      <Dropdown
        items={options}
        size="md"
        value={options.find(({ value }) => value.timeRange === timeRange)?.value}
        onChange={({ timeRange, windowSize, to }) => {
          setTimeRange?.(timeRange);
          setWindowSize?.(windowSize);
          setTo?.(to);
          if (currentPresentation?.isDisabled(timeRange)) {
            setPresentation?.('distinct');
          }
        }}
        className={locals.timeSelectionDropdown}
      />
    );
  } else {
    const options = timePresets.map(p => ({ value: p, label: p.label }));

    return (
      <Dropdown
        items={options}
        size="md"
        value={options.find(({ value }) => value.windowSize === windowSize)?.value}
        onChange={({ windowSize }) => {
          setWindowSize?.(windowSize);
        }}
        className={locals.timeSelectionDropdown}
      />
    );
  }
}
