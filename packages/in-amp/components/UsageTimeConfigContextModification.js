import PropTypes from 'prop-types';
import moment from 'moment';
import React from 'react';

import LocalTimeConfigContextModification from 'in-stores/time/LocalTimeConfigContextModification';
import timePresets from 'in-amp/components/timePresets';

export default function UsageTimeConfigContextModification({ timeConfig, showAggregatedMetrics, children }) {
  return (
    <LocalTimeConfigContextModification
      modification={globalTimeConfig => modifyTimeConfig(globalTimeConfig, showAggregatedMetrics)}
      valuesToWatch={[
        timeConfig.windowSize,
        timeConfig.to,
        timeConfig.focusedMoment,
        timeConfig.autoRefresh,
        showAggregatedMetrics
      ]}
    >
      {children}
    </LocalTimeConfigContextModification>
  );
}

UsageTimeConfigContextModification.propTypes = {
  showAggregatedMetrics: PropTypes.bool.isRequired,
  timeConfig: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.array.isRequired])
};

function modifyTimeConfig(timeConfig, showAggregatedMetrics) {
  const windowSize = findNextPresetTime(timeConfig.windowSize, showAggregatedMetrics);
  const to = getNearestReasonableTo(windowSize);
  return {
    to,
    focusedMoment: to,
    windowSize,
    autoRefresh: false
  };
}

function findNextPresetTime(windowSize, showAggregatedMetrics) {
  if (showAggregatedMetrics) {
    return 1000 * 60 * 60 * 24 * 30;
  }
  for (let i = 0; i < timePresets.length; i++) {
    const preset = timePresets[i];
    if (windowSize === preset.windowSize) {
      return windowSize;
    }
  }
  return timePresets[0].windowSize;
}

function getNearestReasonableTo(windowSize) {
  const dailyData = windowSize > 1000 * 60 * 60 * 24 * 7;
  return moment()
    .startOf(dailyData ? 'day' : 'hour')
    .subtract(1, dailyData ? 'day' : 'hour')
    .toDate()
    .getTime();
}
