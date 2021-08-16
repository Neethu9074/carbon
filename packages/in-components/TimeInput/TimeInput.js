/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import formatInputTime from '../time/TimeSelectionDialogPresenter/timeInputFormatter';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import { timeValidator } from 'in-services/validators/date';
import Input from 'in-components/form/Input';

import locals from './TimeInput.mless';

const withLeadingZeros = value => {
  return String(value).padStart(2, '0');
};

const timeOptions = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const timeString = `${withLeadingZeros(hour)}:${withLeadingZeros(minute)}`;
    timeOptions.push({ value: timeString, label: timeString });
  }
}

export default function TimeInput({ onChange, value = Date.now(), hasError = false, align = 'bottomMiddle', id }) {
  const [time, handleTimeChange] = useState(() => formatInputTime(value, 'HH:mm'));
  const timeValid = timeValidator(time, 'HH:mm') == null;

  // Is needed to update the time input field each time the user uses the slider to adjust the time.
  useLayoutEffect(() => {
    handleTimeChange(() => formatInputTime(value, 'HH:mm'));
  }, [value]);

  const commitTimeChange = newValue => {
    onChange(timeValid ? formatInputTime(newValue, 'HH:mm') : undefined);
  };

  return (
    <ComboBoxBehavior
      align={align}
      options={timeOptions}
      onChange={value => {
        handleTimeChange(value);
        commitTimeChange(value);
      }}
      disableAutomaticOptionSorting
      listItemClassName={locals.listItem}
      value={getNearestNextItem(time)}
    >
      {({ elementProps }) => (
        <TimeInputField
          {...elementProps}
          time={time}
          handleTimeChange={handleTimeChange}
          hasError={hasError}
          id={id}
          commitTimeChange={commitTimeChange}
        />
      )}
    </ComboBoxBehavior>
  );
}

const TimeInputField = React.forwardRef(function TimeInputField(
  { handleTimeChange, commitTimeChange, time, ...remainingProps },
  ref
) {
  return (
    <Input
      {...remainingProps}
      refSetter={ref}
      className={locals.timeInput}
      type="text"
      autoComplete="off"
      value={time}
      onChange={e => handleTimeChange(e.target.value)}
      onBlur={e => commitTimeChange(formatInputTime(e.target.value, 'HH:mm'))}
      pattern="[0-9]{2}:[0-9]{2}"
      maxLength="5"
    />
  );
});

function getNearestNextItem(time) {
  const nearestNextItem =
    timeOptions.find(({ value }) => value === moment(getNextNearestTime(time)).format('HH:mm')) ?? timeOptions[0];
  return nearestNextItem.value;
}

function getNextNearestTime(time) {
  const minutesFactor = moment.duration(15, 'minutes').asMilliseconds();
  return Math.round(moment(time, 'HH:mm').valueOf() / minutesFactor) * minutesFactor;
}

TimeInput.propTypes = {
  align: PropTypes.string,
  hasError: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  id: PropTypes.string
};
