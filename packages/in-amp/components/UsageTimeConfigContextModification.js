import PropTypes from 'prop-types';
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
  return {
    to: null,
    focusedMoment: null,
    windowSize: findNextPresetTime(timeConfig.windowSize, showAggregatedMetrics),
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
