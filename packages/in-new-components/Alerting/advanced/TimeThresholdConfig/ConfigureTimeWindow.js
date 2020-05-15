import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import {
  timeThresholdTypes,
  conditionPersistenceTimes
} from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import DropdownWithTopLabel from 'in-new-components/DropdownWithTopLabel/DropdownWithTopLabel';

export default function ConfigureTimeWindow({ onChange, timeThresholdType, timeThresholdTimeWindow }) {
  const conditionPersistenceTimeForType =
    timeThresholdType === timeThresholdTypes.userImpactOfViolationsInSequence
      ? [conditionPersistenceTimes[0]]
      : conditionPersistenceTimes;

  return (
    <AlertThresholdConfigItemContainer iconType="lib_datetime_timerange">
      <DropdownWithTopLabel
        label={conditionPersistenceTimeForType.find(({ value }) => value === timeThresholdTimeWindow).label}
        align="bottomLeft"
        items={conditionPersistenceTimeForType}
        onClick={({ value }) => onChange(value)}
        topLabel="Time window"
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureTimeWindow.propTypes = {
  onChange: PropTypes.func,
  timeThresholdTimeWindow: PropTypes.number.isRequired,
  timeThresholdType: PropTypes.string.isRequired
};
