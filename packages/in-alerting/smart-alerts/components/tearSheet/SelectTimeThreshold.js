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

export default function SelectTimeThreshold({ form, updateForm, hasTraceImpactOption, impactTimeThresholdDisabled }) {
  const { violationsPersistOverTime, violationsInSequence, violationsInPeriod, traceImpact } =
    timeThresholdTypesTearSheet;

  const currenttimeThreshold = form.get('timeThreshold').get('type').value;
  const selectedTriggerAlert =
    currenttimeThreshold == violationsInSequence || currenttimeThreshold == violationsInPeriod
      ? violationsInSequence
      : traceImpact;
  const selectedPersistanceType =
    currenttimeThreshold == violationsInPeriod ? violationsInPeriod : violationsInSequence;

  const selectBox1 = [createSelectOptionTearSheet(violationsPersistOverTime)];
  if (hasTraceImpactOption && !impactTimeThresholdDisabled) {
    selectBox1.push(createSelectOptionTearSheet(traceImpact));
  }
  const selectBox2 = [
    createSelectOptionTearSheet(violationsInSequence),
    createSelectOptionTearSheet(violationsInPeriod)
  ];
  return (
    <>
      <div className={locals.triggerAlertContainer}>
        <AlertTypography
          variant={'body-regular'}
          color={'color900'}
          content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAlert')}
          noMargin
        />
        <Select
          name="timeThresholdTriggerAlert"
          id="timeThresholdTypeTriggerAlert"
          data-testid="timeThresholdTypeTriggerAlert"
          value={selectedTriggerAlert}
          wrapperClassName={locals.width80}
          useFullWidth
          onChange={e => {
            updateForm(form.put('timeThreshold', getTimeThresholdFormForType(form, e.target.value)));
          }}
        >
          {selectBox1.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      {currenttimeThreshold != traceImpact && (
        <div className={locals.triggerAlertContainer}>
          <AlertTypography
            variant={'body-regular'}
            color={'color900'}
            content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.persistenceType')}
            noMargin
          />
          <Select
            name="timeThresholdPersistenceType"
            id="timeThresholdTypePersistenceType"
            data-testid="timeThresholdTypePersistenceType"
            value={selectedPersistanceType}
            wrapperClassName={locals.width80}
            useFullWidth
            onChange={e => {
              updateForm(form.put('timeThreshold', getTimeThresholdFormForType(form, e.target.value)));
            }}
          >
            {selectBox2.map(({ value, label }) => (
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
  impactTimeThresholdDisabled: PropTypes.bool
};
