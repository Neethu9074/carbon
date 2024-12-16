/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import uniqueId from 'lodash/uniqueId';

// Customized version of Carbon TimePicker for simplified usage.
// 24 hour clock is the only format accepted at this time.
import { CarbonTimePicker } from '@instana/components';

import { timeValidator } from 'in-services/validators/date';
import { TimePickerProps } from './types';

const TimePicker = ({ ...props }: TimePickerProps): JSX.Element => {
  const { onChange, value, id, invalid, invalidText, placeholder, seconds } = props;

  const timePattern24 = seconds ? '([01]d|2[0-3]):?([0-5]d):?([0-5]d))(\\s)?' : '([01]d|2[0-3]):?([0-5]d)(\\s)?';
  const timeInputFormat = seconds ? 'HH:mm:ss' : 'HH:mm';

  const [isInvalidTimeFormat, setIsInvalidTimeFormat] = useState(false);
  const [invalidTimeFormatText, setInvalidTimeFormatText] = useState<string | null>();

  // For now use only 24hr clock
  const [timeInput, setTimeInput] = useState(value);

  //Added this useEffect to reflect the currentTime in the component when re-renders ocurrs and is not the first time.
  useEffect(() => {
    setTimeInput(value);
  }, [value]);

  const changeTimeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let time = event.target.value;
    const errors = timeValidator(time, timeInputFormat);

    // Invalid until user inputs the correct time format
    if (errors?.length) {
      setIsInvalidTimeFormat(true);
      setInvalidTimeFormatText(errors[0]?.message);
      setTimeInput(time);
    } else {
      setIsInvalidTimeFormat(false);
      setInvalidTimeFormatText(undefined);
      setTimeInput(time);
      onChange(time);
    }
  };

  const pickerId = id || uniqueId('time-picker_');

  const pickerProps = {
    ...props,
    id: pickerId,
    pattern: timePattern24,
    invalid: invalid || isInvalidTimeFormat,
    invalidText: invalidText || invalidTimeFormatText,
    maxLength: seconds ? 8 : 5,
    onChange: changeTimeInput,
    placeholder: placeholder || timeInputFormat,
    value: timeInput
  };

  return <CarbonTimePicker {...pickerProps} />;
};

export default TimePicker;
