import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, radioOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './TimeThresholdConfig.mless';

export default function SelectThreshold({ form, onChange }) {
  const { violationsInSequence, violationsInPeriod, userImpactOfViolationsInSequence } = radioOptions.timeThresholdType;
  const checkboxes = [
    {
      label: 'When the condition persists over a specified amount of time',
      checked: form.get(fieldNames.timeThresholdType).value === violationsInSequence,
      onChange: () => onChange(form, fieldNames.timeThresholdType, violationsInSequence)
    },
    {
      label: 'Every time the condition triggers a specified amount of times in a defined time frame',
      checked: form.get(fieldNames.timeThresholdType).value === violationsInPeriod,
      onChange: () => onChange(form, fieldNames.timeThresholdType, violationsInPeriod)
    },
    {
      label: 'When a certain amount of my users are impacted',
      checked: form.get(fieldNames.timeThresholdType).value === userImpactOfViolationsInSequence,
      onChange: () => onChange(form, fieldNames.timeThresholdType, userImpactOfViolationsInSequence)
    }
  ];
  return (
    <>
      {checkboxes.map(({ label, checked, onChange }, i) => (
        <div key={i} className={locals.thresholdTypeSelection}>
          <CheckboxFancy
            wrapperClassName={evaluateClassNames({
              [locals.checkbox]: true,
              [locals.checked]: checked
            })}
            label={label}
            checked={checked}
            onChange={onChange}
            asRadioButton
            withControlsGrayscale
          />
        </div>
      ))}
    </>
  );
}

SelectThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
