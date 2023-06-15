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
  createTraceImpactForm
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import {
  timeThresholdTypes,
  timeThresholdLabels
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import CheckboxFancy from 'in-components/form/CheckboxFancy';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export default function SelectTimeThreshold({
  form,
  updateForm,
  hasUserImpactOption,
  hasTraceImpactOption,
  impactTimeThresholdDisabled,
  hasViolationsInPeriod = true
}) {
  const { violationsInSequence, violationsInPeriod, userImpactOfViolationsInSequence, traceImpact } =
    timeThresholdTypes;
  const checkboxes = hasViolationsInPeriod
    ? [createOption(form, updateForm, violationsInSequence), createOption(form, updateForm, violationsInPeriod)]
    : [createOption(form, updateForm, violationsInSequence)];

  if (hasUserImpactOption) {
    checkboxes.push(createOption(form, updateForm, userImpactOfViolationsInSequence, impactTimeThresholdDisabled));
  }

  if (hasTraceImpactOption) {
    checkboxes.push(createOption(form, updateForm, traceImpact, impactTimeThresholdDisabled));
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

function createOption(form, updateForm, timeThresholdType, disabled = false) {
  return {
    label: timeThresholdLabels[timeThresholdType],
    checked: form.get('timeThreshold').get('type').value === timeThresholdType,
    onChange: () => updateForm(form.put('timeThreshold', getTimeThresholdFormForType(form, timeThresholdType))),
    disabled
  };
}

function getTimeThresholdFormForType(form, timeThresholdType) {
  const timeThreshold = form.get('timeThreshold').toJS();
  const thresholdType = form.get('threshold').toJS().type;

  if (timeThresholdType === timeThresholdTypes.violationsInSequence) {
    return createViolationsInSequenceForm(timeThreshold, thresholdType);
  } else if (timeThresholdType === timeThresholdTypes.violationsInPeriod) {
    return createViolationsInPeriodForm(timeThreshold, thresholdType);
  } else if (timeThresholdType === timeThresholdTypes.userImpactOfViolationsInSequence) {
    return createUserImpactOfViolationsInSequenceForm(timeThreshold, thresholdType);
  } else if (timeThresholdType === timeThresholdTypes.traceImpact) {
    return createTraceImpactForm(timeThreshold, form.get('granularity').value, thresholdType);
  }
}

SelectTimeThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  hasUserImpactOption: PropTypes.bool,
  hasTraceImpactOption: PropTypes.bool,
  impactTimeThresholdDisabled: PropTypes.bool,
  hasViolationsInPeriod: PropTypes.bool
};
