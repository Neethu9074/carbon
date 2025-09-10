/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dropdown } from '@instana/components';

import presentationPresets from 'in-amp/components/presentationPresets';
import usageTimePresets from 'in-amp/components/usageTimePresets';
import fupTimePresets from 'in-amp/components/fupTimePreset';
import timePresets from 'in-amp/components/timePresets';

import locals from './TimeSelection.mless';

export default function TimeSelection({
  windowSize,
  timeRange,
  setWindowSize,
  setTimeRange,
  setTo,
  presentation,
  setPresentation,
  fupTimeRange,
  setFupTimeRange,
  fupWindowSize,
  fupTo,
  fupSetTo,
  setFupWindowSize
}) {
  if (timeRange) {
    const options = usageTimePresets.map(p => ({ value: p, label: p.label }));
    const currentPresentation = presentationPresets.find(preset => preset.presentation === presentation);

    return (
      <Dropdown
        items={options}
        size="md"
        value={options.find(({ value }) => value.timeRange === timeRange)?.value}
        onChange={selectedItem => {
          // Handle both possible structures of the selected item
          const item = selectedItem.value || selectedItem;
          setTimeRange?.(item.timeRange);
          setWindowSize?.(item.windowSize);
          setTo?.(item.to);
          if (currentPresentation?.isDisabled(item.timeRange)) {
            setPresentation?.('distinct');
          }
        }}
        className={locals.timeSelectionDropdown}
      />
    );
  } else if (fupTimeRange && fupWindowSize && fupTo) {
    const options = fupTimePresets.map(p => ({ value: p, label: p.label }));
    return (
      <Dropdown
        items={options}
        size="md"
        value={options.find(({ value }) => value.fupTimeRange === fupTimeRange)?.value}
        onChange={selectedItem => {
          // Handle both possible structures of the selected item
          const item = selectedItem.value || selectedItem;
          setFupTimeRange?.(item.fupTimeRange);
          setFupWindowSize?.(item.fupWindowSize);
          fupSetTo?.(item.fupTo);
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
        onChange={selectedItem => {
          // Handle both possible structures of the selected item
          const item = selectedItem.value || selectedItem;
          setWindowSize?.(item.windowSize);
        }}
        className={locals.timeSelectionDropdown}
      />
    );
  }
}
