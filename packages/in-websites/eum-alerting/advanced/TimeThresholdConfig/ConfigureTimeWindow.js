import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { fieldNames, radioOptions, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import DropdownWithTopLabel from 'in-new-components/DropdownWithTopLabel/DropdownWithTopLabel';

export default function ConfigureTimeWindow({ onChange, form }) {
  const timeThresholdType = form.get(fieldNames.timeThresholdType).value;
  const conditionPersistenceTime =
    timeThresholdType === radioOptions.timeThresholdType.userImpactOfViolationsInSequence
      ? [selectOptions.conditionPersistenceTime[0]]
      : selectOptions.conditionPersistenceTime;

  let timeThresholdTimeWindow = form.get(fieldNames.timeThresholdTimeWindow).value;
  // If the time-window is not supported switch to a supported one.
  if (!conditionPersistenceTime.find(e => e.value === timeThresholdTimeWindow)) {
    timeThresholdTimeWindow = conditionPersistenceTime[0].value;
    onChange(form, fieldNames.timeThresholdTimeWindow, timeThresholdTimeWindow, {
      name: fieldNames.timeThresholdViolations,
      value: 1
    });
  }
  return (
    <AlertThresholdConfigItemContainer iconType="lib_datetime_timerange">
      <DropdownWithTopLabel
        label={conditionPersistenceTime.find(({ value }) => value === timeThresholdTimeWindow).label}
        align="bottomLeft"
        items={conditionPersistenceTime}
        onClick={item => {
          onChange(form, fieldNames.timeThresholdTimeWindow, item.value, {
            name: fieldNames.timeThresholdViolations,
            value: 1
          });
        }}
        topLabel="Time window"
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureTimeWindow.propTypes = {
  onChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired
};
