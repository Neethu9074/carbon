import PropTypes from 'prop-types';
import moment from 'moment';
import React from 'react';

import LocalTimeConfigContextModification from 'in-stores/time/LocalTimeConfigContextModification';
import { days } from 'in-services/time';

export default function UsageTimeConfigContextModification({ windowSize, children }) {
  return (
    <LocalTimeConfigContextModification modification={() => modifyTimeConfig(windowSize)} valuesToWatch={[windowSize]}>
      {children}
    </LocalTimeConfigContextModification>
  );
}

UsageTimeConfigContextModification.propTypes = {
  windowSize: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.array.isRequired])
};

function modifyTimeConfig(windowSize) {
  const to = getNearestReasonableTo(windowSize);
  return {
    to,
    focusedMoment: to,
    windowSize,
    autoRefresh: false
  };
}

function getNearestReasonableTo(windowSize) {
  const dailyData = windowSize > days.toMillis(7);
  return moment()
    .startOf(dailyData ? 'day' : 'hour')
    .subtract(1, dailyData ? 'day' : 'hour')
    .toDate()
    .getTime();
}
