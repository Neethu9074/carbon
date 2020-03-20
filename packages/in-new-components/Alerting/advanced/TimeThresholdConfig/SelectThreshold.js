import PropTypes from 'prop-types';
import React from 'react';

import {
  createViolationsInSequenceForm,
  createViolationsInPeriodForm,
  createUserImpactOfViolationsInSequenceForm
} from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import CheckboxFancy from 'in-new-components/Alerting/components/CheckboxFancy';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './TimeThresholdConfig.mless';

export const timeThresholdLabels = Object.freeze({
  violationsInSequence: 'When the condition persists over a specified amount of time',
  violationsInPeriod: 'Every time the condition triggers a specified amount of times in a defined time frame',
  userImpactOfViolationsInSequence: 'When a certain amount of my users are impacted'
});

export default function SelectThreshold({ form, updateForm, hasUserImpactOption }) {
  const { violationsInSequence, violationsInPeriod, userImpactOfViolationsInSequence } = timeThresholdTypes;
  const checkboxes = [
    createOption(form, updateForm, violationsInSequence),
    createOption(form, updateForm, violationsInPeriod)
  ];

  if (hasUserImpactOption) {
    checkboxes.push(createOption(form, updateForm, userImpactOfViolationsInSequence));
  }

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

function createOption(form, updateForm, thresholdType) {
  return {
    label: timeThresholdLabels[thresholdType],
    checked: form.get('timeThreshold').get('type').value === thresholdType,
    onChange: () => updateForm(form.put('timeThreshold', getTimeThresholdFormForType(form, thresholdType)))
  };
}

function getTimeThresholdFormForType(form, thresholdType) {
  if (thresholdType === 'violationsInSequence') {
    return createViolationsInSequenceForm(form.get('timeThreshold').toJS());
  }
  if (thresholdType === 'violationsInPeriod') {
    return createViolationsInPeriodForm(form.get('timeThreshold').toJS());
  }
  if (thresholdType === 'userImpactOfViolationsInSequence') {
    return createUserImpactOfViolationsInSequenceForm(form.get('timeThreshold').toJS());
  }
}

SelectThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  hasUserImpactOption: PropTypes.bool
};
