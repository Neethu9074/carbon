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
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export default function ConfigureAlertingThreshold({ form, onChange, updateForm, oneMinuteGranularityAllowed }) {
  const granularity = form.get('granularity')?.value;
  const thresholdType = form.get('threshold').get('type')?.value;
  const timeThresholdForm = form.get('timeThreshold');
  const timeThresholdType = timeThresholdForm.get('type')?.value;
  const marks = getMarksForThresholdType(thresholdType, oneMinuteGranularityAllowed);
  const granularityInMinutes = marks.find(
    (i => i.millis === granularity) ?? getDefaultMark(marks, thresholdType)
  ).value;

  const timeThresholdTimeWindow = timeThresholdForm.get('timeWindow').value;
  const hasError = !timeThresholdTimeWindow.valid && timeThresholdTimeWindow.touched;
  const timeThresholdViolations = timeThresholdForm.get('violations')?.value;

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
    return timeThresholdType === timeThresholdTypes.violationsInPeriod ? (
      <ConfigureTimeWindow
        label={label}
        onChange={onChangeTimeWindow}
        timeThresholdTimeWindow={timeThresholdTimeWindow}
        granularity={granularity}
        form={form}
        hasError={hasError}
        granularityInMinutes={granularityInMinutes}
        timeThresholdType={timeThresholdType}
        onChangeViolations={onChangeViolationsInPeriod}
        violations={timeThresholdViolations}
        maxViolations={Math.round(timeThresholdTimeWindow / granularity)}
      />
    ) : (
      <ConfigureTimeWindow
        label={label}
        onChange={onChangeTimeWindow}
        timeThresholdTimeWindow={timeThresholdTimeWindow}
        granularity={granularity}
        form={form}
        hasError={hasError}
        granularityInMinutes={granularityInMinutes}
        timeThresholdType={timeThresholdType}
      />
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
    updateForm(form.updateIn(['timeThreshold', 'violations'], f => f.setValue(violations).setTouched(true)));
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
