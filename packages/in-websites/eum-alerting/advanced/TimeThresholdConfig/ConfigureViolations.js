import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import DropdownWithTopLabel from 'in-new-components/DropdownWithTopLabel/DropdownWithTopLabel';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';

const violationGranularity = 10 * 60 * 1000;

export default function ConfigureViolations({ onChange, form }) {
  const timeThresholdTimeWindow = form.get(fieldNames.timeThresholdTimeWindow).value;
  const timeThresholdViolations = form.get(fieldNames.timeThresholdViolations).value;

  return (
    <AlertThresholdConfigItemContainer iconType="lib_events_inverted">
      <DropdownWithTopLabel
        label={`${timeThresholdViolations}`}
        align="bottomLeft"
        items={Array.from(Array(+timeThresholdTimeWindow / violationGranularity).fill(0), (x, i) => ({
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

ConfigureViolations.propTypes = {
  onChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired
};
