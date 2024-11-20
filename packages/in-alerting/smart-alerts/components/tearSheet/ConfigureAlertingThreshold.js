/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  getMarksForThresholdType,
  getDefaultMark
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureGranularity';
import ConfigureUserImpact from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureUserImpact';
import ConfigureTraceImpact from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/ConfigureTraceImpact';
import ConfigureTimeWindow from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/ConfigureTimeWindow';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export default function ConfigureAlertingThreshold({ form, onChange, updateForm, oneMinuteGranularityAllowed }) {
  const granularity = form.get('granularity')?.value;
  const thresholdType = form.get('threshold').get('warningThreshold').get('type')?.value;
  const timeThresholdForm = form.get('timeThreshold');
  const timeThresholdType = timeThresholdForm.get('type')?.value;
  const marks = getMarksForThresholdType(thresholdType, oneMinuteGranularityAllowed);
  const granularityInMinutes = marks.find(
    (i => i.millis === granularity) ?? getDefaultMark(marks, thresholdType)
  ).value;

  const timeThresholdTimeWindowField = timeThresholdForm.get('timeWindow');
  const timeThresholdTimeWindow = timeThresholdTimeWindowField?.value;
  const hasErrorTimeWindow = !timeThresholdTimeWindowField?.valid && timeThresholdTimeWindowField?.touched;
  const timeThresholdViolationsField = timeThresholdForm.get('violations');
  const timeThresholdViolations = timeThresholdViolationsField?.value;
  const hasErrorViolations = !timeThresholdViolationsField?.valid && timeThresholdViolationsField?.touched;
  return (
    <div className={locals.alertThresholdConfigContainer}>
      {getConfigureTimeWindow(timeThresholdType)}
      {getConfigureViolationsOrUserImpact(timeThresholdType)}
    </div>
  );

  function getConfigureTimeWindow(timeThresholdType) {
    let label;
    if (
      (timeThresholdType === timeThresholdTypes.violationsInSequence) |
      (timeThresholdType === timeThresholdTypes.violationsInPeriod)
    ) {
      label = t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAfter');
    } else if (timeThresholdType === timeThresholdTypes.userImpactOfViolationsInSequence) {
      label = t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfEvaluationWindows');
    } else if (timeThresholdType === timeThresholdTypes.traceImpact) {
      return <ConfigureTraceImpact form={form} onChange={onChange} />;
    }
    return (
      <>
        <ConfigureTimeWindow
          label={label}
          onChange={onChangeTimeWindow}
          timeThresholdTimeWindow={timeThresholdTimeWindow}
          granularity={granularity}
          form={form}
          hasErrorViolations={hasErrorViolations}
          hasErrorTimeWindow={hasErrorTimeWindow}
          granularityInMinutes={granularityInMinutes}
          timeThresholdType={timeThresholdType}
          {...(timeThresholdType === timeThresholdTypes.violationsInPeriod && {
            violations: timeThresholdViolations,
            onChangeViolations: onChangeViolationsInPeriod,
            maxViolations: Math.round(timeThresholdTimeWindow / granularity)
          })}
        />
        {timeThresholdType === timeThresholdTypes.violationsInPeriod ? (
          <div className={locals.violationsInPeriodValidationContainer}>
            {(timeThresholdForm.containsKey('violations') || timeThresholdForm.containsKey('timeWindow')) && (
              <div className={locals.traceImpactValidation}>
                <TouchedMessages field={timeThresholdForm?.get('violations') ?? timeThresholdForm?.get('timeWindow')} />
              </div>
            )}
          </div>
        ) : (
          <div className={locals.traceImpactValidationContainer}>
            {timeThresholdForm.containsKey('timeWindow') && (
              <div className={locals.traceImpactValidation}>
                <TouchedMessages field={timeThresholdForm.get('timeWindow')} />
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  function getConfigureViolationsOrUserImpact(timeThresholdType) {
    if (timeThresholdType === timeThresholdTypes.userImpactOfViolationsInSequence) {
      return <ConfigureUserImpact form={form} onChange={onChange} updateForm={updateForm} />;
    } else {
      return null;
    }
  }

  function onChangeViolationsInPeriod(violations) {
    updateForm(form.updateIn(['timeThreshold', 'violations'], f => f.setValue(parseInt(violations)).setTouched(true)));
  }

  function onChangeTimeWindow(timeWindowValue) {
    let updatedForm = timeThresholdForm.updateIn(['timeWindow'], f => f.setValue(timeWindowValue).setTouched(true));

    if (timeThresholdType === timeThresholdTypes.violationsInPeriod) {
      const granularity = form.get('granularity').value;
      const oldViolations = timeThresholdForm.get('violations').value;
      const maxViolations = parseInt(timeWindowValue / granularity);

      updatedForm = updatedForm.updateIn(['violations'], f =>
        f.setValue(Math.min(oldViolations, maxViolations)).setTouched(true)
      );
    }

    updateForm(form.put('timeThreshold', updatedForm));
  }
}

ConfigureAlertingThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  oneMinuteGranularityAllowed: PropTypes.bool
};
