import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import DropdownWithTopLabel from 'in-new-components/DropdownWithTopLabel/DropdownWithTopLabel';

export default function ConfigureTimeWindow({ onChange, form }) {
  const timeThresholdTimeWindow = form.get(fieldNames.timeThresholdTimeWindow).value;
  return (
    <AlertThresholdConfigItemContainer iconType="lib_datetime_timerange">
      <DropdownWithTopLabel
        label={selectOptions.conditionPersistenceTime.find(({ value }) => value === timeThresholdTimeWindow).label}
        align="bottomLeft"
        items={selectOptions.conditionPersistenceTime}
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
