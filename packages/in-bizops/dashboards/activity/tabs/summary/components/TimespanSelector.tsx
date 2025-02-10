/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonMenuButton as MenuButton, CarbonMenuItem as MenuItem } from '@instana/components';
import { DurationDistributionScale } from '@instana/types';

import locals from './TimespanSelector.mless';

export type TimespanSelectorOption = {
  value: DurationDistributionScale;
  label: string;
};

export type TimespanSelectorProps = {
  timespans: TimespanSelectorOption[];
  selectedTimespan: DurationDistributionScale;
  onChange: (v: any) => void;
};

// Dropdown displayed with duration distribution chart which allows the user to select a timespan
export default function TimespanSelector({ timespans, selectedTimespan, onChange }: TimespanSelectorProps) {
  const selected = selectedTimespan.toLocaleLowerCase();

  const onClick = (item: TimespanSelectorOption) => {
    if (onChange) {
      onChange(item.value);
    }
  };

  return (
    <MenuButton
      kind="ghost"
      size="sm"
      label={`1 ${selected}`}
      title={'timespan'}
      menuAlignment="bottom-start"
      className={locals.timespan}
    >
      {timespans?.length
        ? timespans.map(item => {
            return (
              <MenuItem
                key={item.label}
                label={item.label}
                onClick={() => onClick(item)}
                className={item.value === selectedTimespan ? locals.selected : undefined}
              />
            );
          })
        : null}
    </MenuButton>
  );
}
