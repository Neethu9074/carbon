import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import DropdownWithTopLabel from 'in-new-components/DropdownWithTopLabel/DropdownWithTopLabel';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';

export default function ConfigureViolationsInPeriod({ onChange, form }) {
  const timeThresholdEvaluations = form.get(fieldNames.timeThresholdEvaluations).value;
  const timeThresholdViolations = form.get(fieldNames.timeThresholdViolations).value;

  return (
    <AlertThresholdConfigItemContainer iconType="lib_events_inverted">
      <DropdownWithTopLabel
        label={`${timeThresholdViolations}`}
        align="bottomLeft"
        items={Array.from(Array(+timeThresholdEvaluations).fill(0), (x, i) => ({
          value: i + 1,
          label: `${i + 1}`
        }))}
        onClick={item => {
          onChange(form, fieldNames.timeThresholdViolations, item.value);
        }}
        topLabel="Violations"
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureViolationsInPeriod.propTypes = {
  onChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired
};
