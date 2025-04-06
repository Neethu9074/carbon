/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { minutesToMilliseconds, parse } from 'date-fns';
import React, { useState } from 'react';
import classNames from 'classnames';
import { uniqueId } from 'lodash';

import { CarbonComboBox } from '@instana/components';

import formatInputTime, { withLeadingZeros } from 'in-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { timeValidator } from 'in-services/validators/date';
import { timeFormat } from 'in-services/formatters/date';

import locals from './TimeInput.mless';

interface TimeInputProps {
  /** Defines aria-label to the input */
  ['aria-label']?: string;
  onChange: (time: string) => void;
  value: string;
  hasError?: boolean;
  id?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  /** default value is 'bottom' if not specified */
  direction?: 'top' | 'bottom';
}

const timeInputFormat = 'HH:mm';

const timeOptions: string[] = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const timeString = `${withLeadingZeros(hour)}:${withLeadingZeros(minute)}`;
    timeOptions.push(timeString);
  }
}

export default function TimeInput({
  onChange,
  value,
  hasError = false,
  id,
  fullWidth,
  disabled,
  direction = 'bottom',
  ...props
}: TimeInputProps) {
  // Here we receive the value in HH:mm:ss format, either based on timeInput or the slider.
  // But we need to display this value in HH:mm format.
  const [time, setTime] = useState(() => formatInputTime(value, timeInputFormat));
  const [invalid, setInvalid] = useState(true);

  const { 'aria-label': ariaLabel } = props;

  const handleTimeChange = (newValue: string) => {
    const timeInvalid = timeValidator(newValue, timeInputFormat) !== null;
    setTime(newValue);
    setInvalid(timeInvalid);
    if (!timeInvalid && onChange) onChange(formatInputTime(newValue, timeFormat));
  };

  function getNearestNextItem() {
    const nearestNextItem = timeOptions.findIndex(
      value => value === formatDateWithActiveLanguage(getNextNearestTime(time), timeInputFormat)
    );
    return nearestNextItem !== -1 ? nearestNextItem : 0;
  }

  return (
    <CarbonComboBox
      aria-label={ariaLabel}
      disabled={disabled}
      allowCustomValue
      items={timeOptions}
      onChange={(data: any) => {
        if (data.inputValue === undefined && data.selectedItem === undefined) return;
        handleTimeChange(data.inputValue ?? data.selectedItem);
      }}
      onInputChange={handleTimeChange}
      initialSelectedItem={time}
      selectedItem={time}
      value={time}
      invalid={hasError || invalid}
      id={id ?? uniqueId('timeinput_')}
      pattern="[0-9]{2}:[0-9]{2}"
      maxLength={5}
      className={classNames(locals.carbonTimeCombo, {
        [locals.stdWidth]: !fullWidth
      })}
      size="sm"
      downshiftProps={{ highlightedIndex: getNearestNextItem() }}
      direction={direction}
    />
  );
}

function getNextNearestTime(input: string) {
  const minutesFactor = minutesToMilliseconds(15);

  return Math.round(parse(input, timeInputFormat, new Date()).getTime() / minutesFactor) * minutesFactor;
}
