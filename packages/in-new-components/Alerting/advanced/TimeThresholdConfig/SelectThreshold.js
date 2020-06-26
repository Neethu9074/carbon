import PropTypes from 'prop-types';
import React from 'react';

import {
  createViolationsInSequenceForm,
  createViolationsInPeriodForm,
  createUserImpactOfViolationsInSequenceForm,
  createRequestImpactForm
} from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import CheckboxFancy from 'in-new-components/Alerting/components/CheckboxFancy';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './TimeThresholdConfig.mless';

export const timeThresholdLabels = Object.freeze({
  violationsInSequence: 'When the condition persists over a specified amount of time',
  violationsInPeriod: 'Every time the condition triggers a specified amount of times in a defined time frame',
  userImpactOfViolationsInSequence: 'When a certain amount of my users are impacted',
  requestImpact: 'When a certain amount of requests are impacted'
});

export default function SelectThreshold({ form, updateForm, hasUserImpactOption, hasRequestImpactOption }) {
  const {
    violationsInSequence,
    violationsInPeriod,
    userImpactOfViolationsInSequence,
    requestImpact
  } = timeThresholdTypes;
  const checkboxes = [
    createOption(form, updateForm, violationsInSequence),
    createOption(form, updateForm, violationsInPeriod)
  ];

  if (hasUserImpactOption) {
    checkboxes.push(createOption(form, updateForm, userImpactOfViolationsInSequence));
  }

  if (hasRequestImpactOption) {
    checkboxes.push(createOption(form, updateForm, requestImpact));
  }

  return (
    <>
      {checkboxes.map(({ label, checked, onChange }, i) => (
        <div
          key={i}
          className={evaluateClassNames({
            [locals.thresholdTypeSelection]: true,
            [locals.checked]: checked
          })}
        >
          <CheckboxFancy
            wrapperClassName={locals.checkbox}
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
  if (thresholdType === 'requestImpact') {
    return createRequestImpactForm(form.get('timeThreshold').toJS());
  }
}

SelectThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  hasUserImpactOption: PropTypes.bool,
  hasRequestImpactOption: PropTypes.bool
};
