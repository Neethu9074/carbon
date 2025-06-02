/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Select } from '@instana/components';

import {
  timeThresholdTypesTearSheet,
  timeThresholdLabelsTearSheet
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import { getTimeThresholdFormForType } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/SelectTimeThreshold';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/SelectTimeThreshold.mless';

export default function SelectTimeThreshold({
  form,
  updateForm,
  hasTraceImpactOption,
  hasUserImpactOption,
  impactTimeThresholdDisabled
}) {
  const {
    violationsPersistOverTime,
    violationsInSequence,
    violationsInPeriod,
    traceImpact,
    userImpactOfViolationsInSequence
  } = timeThresholdTypesTearSheet;

  const timeThresholdTypeSelected = form.get('timeThreshold').get('type').value;
  const selectedTriggerAlert =
    timeThresholdTypeSelected == violationsInSequence || timeThresholdTypeSelected == violationsInPeriod
      ? violationsInSequence
      : timeThresholdTypeSelected;
  const selectedPersistanceType =
    timeThresholdTypeSelected == violationsInPeriod ? violationsInPeriod : violationsInSequence;

  const triggerTypeSelect = [createSelectOptionTearSheet(violationsPersistOverTime)];
  if (hasTraceImpactOption && !impactTimeThresholdDisabled) {
    triggerTypeSelect.push(createSelectOptionTearSheet(traceImpact));
  }
  if (hasUserImpactOption && !impactTimeThresholdDisabled) {
    triggerTypeSelect.push(createSelectOptionTearSheet(userImpactOfViolationsInSequence));
  }
  const persistenceTypeSelect = [
    createSelectOptionTearSheet(violationsInSequence),
    createSelectOptionTearSheet(violationsInPeriod)
  ];
  return (
    <>
      <div className={locals.triggerAlertContainer}>
        <span className={locals.label}>
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAlert')}
            noMargin
          />
        </span>
        <Select
          name="timeThresholdTriggerAlert"
          id="timeThresholdTypeTriggerAlert"
          data-testid="timeThresholdTypeTriggerAlert"
          value={selectedTriggerAlert}
          useFullWidth
          onChange={e => {
            updateForm(form.put('timeThreshold', getTimeThresholdFormForType(form, e.target.value)));
          }}
        >
          {triggerTypeSelect.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      {timeThresholdTypeSelected != traceImpact && timeThresholdTypeSelected != userImpactOfViolationsInSequence && (
        <div className={locals.triggerAlertContainer}>
          <span className={locals.label}>
            <AlertTypography
              variant="body-regular"
              color="color900"
              content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.persistenceType')}
              noMargin
            />
          </span>
          <Select
            name="timeThresholdPersistenceType"
            id="timeThresholdTypePersistenceType"
            data-testid="timeThresholdTypePersistenceType"
            value={selectedPersistanceType}
            useFullWidth
            onChange={e => {
              updateForm(form.put('timeThreshold', getTimeThresholdFormForType(form, e.target.value)));
            }}
          >
            {persistenceTypeSelect.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      )}
    </>
  );
}

function createSelectOptionTearSheet(timeThresholdType) {
  return {
    label: timeThresholdLabelsTearSheet[timeThresholdType],
    value:
      timeThresholdType == timeThresholdTypesTearSheet.violationsPersistOverTime
        ? timeThresholdTypesTearSheet.violationsInSequence
        : timeThresholdType
  };
}

SelectTimeThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  hasTraceImpactOption: PropTypes.bool,
  hasUserImpactOption: PropTypes.bool,
  impactTimeThresholdDisabled: PropTypes.bool
};
