/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';

import locals from './TimespanSelector.mless';

export enum ValidTimespanSelection {
  'Minute',
  'Hour',
  'Day',
  'Week'
}

export type TimespanSelectorOption = {
  value: ValidTimespanSelection;
  label: string;
};

export type TimespanSelectorProps = {
  timespans: TimespanSelectorOption[];
  selectedTimespan: ValidTimespanSelection;
  onChange: (v: any) => void;
};

export default function TimespanSelector({ timespans, selectedTimespan, onChange }: TimespanSelectorProps) {
  return (
    <ComboBoxBehavior
      options={timespans}
      value={selectedTimespan}
      disableAutomaticOptionSorting
      onChange={onChange}
      requiresCustomInteractivity
      aria-label={'timespan'}
    >
      {({ elementProps }) => (
        <Button {...elementProps} kind="subtle" size="compact" icon="lib_arrow_drop_down" className={locals.timespan}>
          <span>1 {ValidTimespanSelection[selectedTimespan]}</span>
        </Button>
      )}
    </ComboBoxBehavior>
  );
}
