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
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import CheckboxFancy from 'in-alerting/smart-alerts/components/smart-alert-dialog/CheckboxFancy';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export const timeThresholdLabels = Object.freeze({
  violationsInSequence: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdLabelViolationsInSequence'
  ),
  violationsInPeriod: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdLabelViolationsInPeriod'
  ),
  userImpactOfViolationsInSequence: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdLabelUserImpactOfViolationsInSequence'
  ),
  requestImpact: t(
    'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigTimeThresholdLabelRequestImpact'
  )
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
