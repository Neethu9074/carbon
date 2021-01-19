/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
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

import locals from './TimeThresholdConfig.mless';

export const timeThresholdLabels = Object.freeze({
  violationsInSequence: 'When the condition persists over a specified amount of time',
  violationsInPeriod: 'Every time the condition triggers a specified amount of times in a defined time frame',
  userImpactOfViolationsInSequence: 'When a certain amount of my users are impacted',
  requestImpact: 'When a certain amount of requests are impacted'
});

export default function SelectTimeThreshold({
  form,
  updateForm,
  hasUserImpactOption,
  hasRequestImpactOption,
  impactTimeThresholdDisabled
}) {
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
    checkboxes.push(createOption(form, updateForm, userImpactOfViolationsInSequence, impactTimeThresholdDisabled));
  }

  if (hasRequestImpactOption) {
    checkboxes.push(createOption(form, updateForm, requestImpact, impactTimeThresholdDisabled));
  }

  return (
    <>
      {checkboxes.map(({ label, checked, onChange, disabled }, i) => (
        <div
          key={i}
          className={classNames({
            [locals.thresholdTypeSelection]: true,
            [locals.checked]: checked,
            [locals.disabled]: disabled
          })}
        >
          <CheckboxFancy
            wrapperClassName={disabled ? locals.checkboxDisabled : locals.checkbox}
            label={label}
            checked={checked}
            onChange={onChange}
            asRadioButton
            withControlsGrayscale
            disabled={disabled}
          />
        </div>
      ))}
    </>
  );
}

function createOption(form, updateForm, thresholdType, disabled = false) {
  return {
    label: timeThresholdLabels[thresholdType],
    checked: form.get('timeThreshold').get('type').value === thresholdType,
    onChange: () => updateForm(form.put('timeThreshold', getTimeThresholdFormForType(form, thresholdType))),
    disabled
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

SelectTimeThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  hasUserImpactOption: PropTypes.bool,
  hasRequestImpactOption: PropTypes.bool,
  impactTimeThresholdDisabled: PropTypes.bool
};
