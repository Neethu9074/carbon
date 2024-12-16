/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getTime, startOfDay, startOfHour, subDays, subHours } from 'date-fns';
import PropTypes from 'prop-types';
import React from 'react';

import LocalTimeConfigContextModification from 'in-stores/time/LocalTimeConfigContextModification';
import { days } from 'in-services/time';

export default function UsageTimeConfigContextModification({ windowSize, to, children }) {
  return (
    <LocalTimeConfigContextModification
      modification={() => modifyTimeConfig(windowSize, to)}
      valuesToWatch={[windowSize]}
    >
      {children}
    </LocalTimeConfigContextModification>
  );
}

UsageTimeConfigContextModification.propTypes = {
  windowSize: PropTypes.number.isRequired,
  to: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.array.isRequired])
};

function modifyTimeConfig(windowSize, to) {
  const determinedTo = to ?? getNearestReasonableTo(windowSize);
  return {
    to: determinedTo,
    focusedMoment: determinedTo,
    windowSize,
    autoRefresh: false
  };
}

function getNearestReasonableTo(windowSize) {
  const dailyData = windowSize > days.toMillis(7);

  const startOf = dailyData ? startOfDay : startOfHour;
  const subtract = dailyData ? subDays : subHours;

  return getTime(subtract(startOf(new Date()), 1));
}
