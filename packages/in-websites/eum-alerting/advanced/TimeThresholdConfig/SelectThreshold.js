import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, radioOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import CheckboxFancy from 'in-websites/eum-alerting/advanced/components/CheckboxFancy';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './TimeThresholdConfig.mless';

export const timeThresholdLabels = Object.freeze({
  violationsInSequence: 'When the condition persists over a specified amount of time',
  violationsInPeriod: 'Every time the condition triggers a specified amount of times in a defined time frame',
  userImpactOfViolationsInSequence: 'When a certain amount of my users are impacted'
});

export default function SelectThreshold({ form, onChange }) {
  const { violationsInSequence, violationsInPeriod, userImpactOfViolationsInSequence } = radioOptions.timeThresholdType;
  const checkboxes = [
    createOption(form, onChange, violationsInSequence),
    createOption(form, onChange, violationsInPeriod),
    createOption(form, onChange, userImpactOfViolationsInSequence)
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

function createOption(form, onChange, thresholdType) {
  return {
    label: timeThresholdLabels[thresholdType],
    checked: form.get(fieldNames.timeThresholdType).value === thresholdType,
    onChange: () => onChange(form, fieldNames.timeThresholdType, thresholdType)
  };
}

SelectThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
