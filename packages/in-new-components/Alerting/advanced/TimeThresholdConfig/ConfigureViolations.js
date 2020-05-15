import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import DropdownWithTopLabel from 'in-new-components/DropdownWithTopLabel/DropdownWithTopLabel';

export default function ConfigureViolations({
  onChange,
  timeThresholdTimeWindow,
  timeThresholdViolations,
  violationGranularity
}) {
  return (
    <AlertThresholdConfigItemContainer iconType="lib_alerting_threshold_icon">
      <DropdownWithTopLabel
        label={`${timeThresholdViolations}`}
        align="bottomLeft"
        items={Array.from(Array(+timeThresholdTimeWindow / violationGranularity).fill(0), (x, i) => ({
          value: i + 1,
          label: `${i + 1}`
        }))}
        onClick={item =>
          onChange(['timeThreshold', 'violations'], field => field.setValue(item.value).setTouched(true))
        }
        topLabel="Violations"
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureViolations.propTypes = {
  onChange: PropTypes.func,
  timeThresholdTimeWindow: PropTypes.number.isRequired,
  timeThresholdViolations: PropTypes.string.isRequired,
  violationGranularity: PropTypes.number.isRequired
};
