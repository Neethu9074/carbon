import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import {
  timeThresholdTypes,
  conditionPersistenceTimes
} from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import DropdownWithTopLabel from 'in-new-components/DropdownWithTopLabel/DropdownWithTopLabel';

export default function ConfigureTimeWindow({ form, updateForm }) {
  const timeThresholdType = form.get('timeThreshold').get('type').value;
  const timeThresholdTimeWindow = form.get('timeThreshold').get('timeWindow').value;

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
        onClick={item => {
          updateForm(form.updateIn(['timeThreshold', 'timeWindow'], f => f.setValue(item.value).setTouched(true)));
        }}
        topLabel="Time window"
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureTimeWindow.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
