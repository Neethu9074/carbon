import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import DropdownWithTopLabel from 'in-new-components/DropdownWithTopLabel/DropdownWithTopLabel';

export default function ConfigureViolationsInSequence({ items, onChange, form }) {
  const timeThresholdEvaluations = form.get(fieldNames.timeThresholdEvaluations).value;
  return (
    <AlertThresholdConfigItemContainer iconType="lib_datetime_timerange">
      <DropdownWithTopLabel
        label={selectOptions.conditionPersistenceTime.find(({ value }) => value === timeThresholdEvaluations).label}
        align="bottomLeft"
        items={items}
        onClick={item => {
          onChange(form, fieldNames.timeThresholdEvaluations, item.value, {
            name: fieldNames.timeThresholdViolations,
            value: 1
          });
        }}
        topLabel="Time window"
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureViolationsInSequence.propTypes = {
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired
};
