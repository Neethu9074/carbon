/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useLayoutEffect } from 'react';
import { minutesToMilliseconds, parse } from 'date-fns';
import PropTypes from 'prop-types';

import formatInputTime, { withLeadingZeros } from 'in-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import { timeValidator } from 'in-services/validators/date';
import { timeFormat } from 'in-services/formatters/date';
import Input from 'in-components/form/Input';

import locals from './TimeInput.mless';

const timeInputFormat = 'HH:mm';

const timeOptions = [];
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 15) {
    const timeString = `${withLeadingZeros(hour)}:${withLeadingZeros(minute)}`;
    timeOptions.push({ value: timeString, label: timeString });
  }
}

export default function TimeInput({ onChange, value, hasError = false, align = 'bottomMiddle', id }) {
  // Here we receive the value in HH:mm:ss format, either based on timeInput or the slider.
  // But we need to display this value in HH:mm format.
  const [time, handleTimeChange] = useState(() => formatInputTime(value, timeInputFormat));
  const timeValid = timeValidator(time, timeInputFormat) == null;

  // Is needed to update the time input field each time the user uses the slider to adjust the time.
  useLayoutEffect(() => {
    handleTimeChange(() => formatInputTime(value, timeInputFormat));
  }, [value]);

  const commitTimeChange = newValue => {
    // Here in onChange we pass the newValue in the form of HH:mm. So we convert input from HH:mm format to respective HH:mm:ss
    // In case of invalid input, we pass '' so we reset the time to 00:00
    onChange(formatInputTime(timeValid ? newValue : '', timeFormat));
  };

  return (
    <ComboBoxBehavior
      align={align}
      options={timeOptions}
      onChange={v => {
        handleTimeChange(v);
        commitTimeChange(v);
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
    timeOptions.find(
      ({ value }) => value === formatDateWithActiveLanguage(getNextNearestTime(time), timeInputFormat)
    ) ?? timeOptions[0];

  return nearestNextItem.value;
}

function getNextNearestTime(time) {
  const minutesFactor = minutesToMilliseconds(15);

  return Math.round(parse(time, timeInputFormat, new Date()).getTime() / minutesFactor) * minutesFactor;
}

TimeInput.propTypes = {
  align: PropTypes.string,
  hasError: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  id: PropTypes.string
};
