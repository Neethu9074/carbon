import PropTypes from 'prop-types';
import React from 'react';

import LocalTimeConfigContextModification from 'in-stores/time/LocalTimeConfigContextModification';
import timePresets from 'in-amp/components/timePresets';

export default function UsageTimeConfigContextModification({ timeConfig, children }) {
  return (
    <LocalTimeConfigContextModification
      modification={modifyTimeConfig}
      valuesToWatch={[timeConfig.windowSize, timeConfig.to, timeConfig.focusedMoment, timeConfig.autoRefresh]}
    >
      {children}
    </LocalTimeConfigContextModification>
  );
}

UsageTimeConfigContextModification.propTypes = {
  timeConfig: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
};

function modifyTimeConfig(timeConfig) {
  return {
    to: null,
    focusedMoment: null,
    windowSize: findNextPresetTime(timeConfig.windowSize),
    autoRefresh: false
  };
}

function findNextPresetTime(windowSize) {
  for (let i = 0; i < timePresets.length; i++) {
    const preset = timePresets[i];
    if (windowSize === preset.windowSize) {
      return windowSize;
    }
  }
  return timePresets[0].windowSize;
}
