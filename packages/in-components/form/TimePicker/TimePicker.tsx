/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import uniqueId from 'lodash/uniqueId';
import React, { useState } from 'react';

// Customized version of Carbon TimePicker for simplified usage.
import { CarbonTimePicker, CarbonTimePickerSelect, CarbonSelectItem } from '@instana/components';

import { TimePickerProps } from './types';
import { t } from 'in-i18n';

const TimePicker = ({ ...props }: TimePickerProps): JSX.Element => {
  const { onChange, value, id, invalid, invalidText, maxLength, placeholder } = props;

  const timePattern24 = '([01]d|2[0-3]):?([0-5]d)(\\s)?';
  const timePatternRegex24 = /^([01]\d|2[0-3]):?([0-5]\d)$/;

  const [isInvalidTimeFormat, setIsInvalidTimeFormat] = useState(false);

  // For now use only 24hr clock
  const [timeInput, setTimeInput] = useState(value);

  const isTimeValid = (t: string) => {
    const regex = timePatternRegex24;
    return regex.test(t);
  };

  const changeTimeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setTimeToParam()
    let time = event.target.value;
    // Invalid until user inputs the correct time format
    if (isTimeValid(time)) {
      time = time.padStart(5, '0');
      setIsInvalidTimeFormat(false);
      setTimeInput(time);
      if (onChange) onChange(time);
    } else {
      setIsInvalidTimeFormat(true);
      setTimeInput(time);
    }
  };

  const pickerId = id || uniqueId('time-picker_');

  const pickerProps = {
    ...props,
    id: pickerId,
    pattern: timePattern24,
    invalid: invalid || isInvalidTimeFormat,
    invalidText: invalid ? invalidText : t('in-components:timepicker.invalid_TimeFormat'),
    maxLength: maxLength || 5,
    onChange: changeTimeInput,
    placeholder: placeholder || '00:00',
    value: timeInput
  };

  return (
    <CarbonTimePicker {...pickerProps}>
      <CarbonTimePickerSelect id={`${pickerId}_24hr`} defaultValue={'24'}>
        <CarbonSelectItem text={t('in-components:timepicker.clock_24')} value="24" />
      </CarbonTimePickerSelect>
    </CarbonTimePicker>
  );
};

export default TimePicker;
