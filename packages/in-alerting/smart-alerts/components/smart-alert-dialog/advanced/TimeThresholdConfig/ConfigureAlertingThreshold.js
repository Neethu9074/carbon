/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import ConfigureRequestImpact from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/ConfigureRequestImpact';
import ConfigureGranularity from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/ConfigureGranularity';
import ConfigureTimeWindow from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/ConfigureTimeWindow';
import ConfigureViolations from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/ConfigureViolations';
import ConfigureUserImpact from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/ConfigureUserImpact';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/formData';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export default function ConfigureAlertingThreshold({ form, onChange, updateForm }) {
  const granularity = form.get('granularity')?.value;
  const timeThresholdForm = form.get('timeThreshold');
  const timeThresholdType = timeThresholdForm.get('type')?.value;
  const timeThresholdTimeWindow = timeThresholdForm.get('timeWindow').value;
  const timeThresholdViolations = timeThresholdForm.get('violations')?.value;

  return (
    <div className={locals.alertThresholdConfigContainer}>
      {granularity && (
        <>
          <ConfigureGranularity onChange={onChangeGranularity} granularity={granularity} />
          {getConfigureTimeWindow(timeThresholdType)}
          {getConfigureViolationsOrUserImpact(timeThresholdType)}
        </>
      )}
    </div>
  );

  function getConfigureTimeWindow(timeThresholdType) {
    let label;
    if (timeThresholdType === timeThresholdTypes.violationsInSequence) {
      label = t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfConsecutiveViolations');
    } else if (timeThresholdType === timeThresholdTypes.violationsInPeriod) {
      label = t(
        'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfConsecutiveEvaluations'
      );
    } else if (timeThresholdType === timeThresholdTypes.userImpactOfViolationsInSequence) {
      label = t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfEvaluationWindows');
    } else if (timeThresholdType === timeThresholdTypes.requestImpact) {
      return <ConfigureRequestImpact form={form} onChange={onChange} />;
    }
    return (
      <ConfigureTimeWindow
        label={label}
        onChange={onChangeTimeWindow}
        timeThresholdTimeWindow={timeThresholdTimeWindow}
        granularity={granularity}
      />
    );
  }

  function getConfigureViolationsOrUserImpact(timeThresholdType) {
    if (timeThresholdType === timeThresholdTypes.violationsInPeriod) {
      return (
        <ConfigureViolations
          label={t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfViolations')}
          onChange={onChangeViolationsInPeriod}
          violations={timeThresholdViolations}
          maxViolations={Math.round(timeThresholdTimeWindow / granularity)}
        />
      );
    } else if (timeThresholdType === timeThresholdTypes.userImpactOfViolationsInSequence) {
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

  function onChangeGranularity(newGranularity) {
    const oldGranularity = form.get('granularity').value;
    const oldTimeWindow = form.get('timeThreshold').get('timeWindow').value;
    const violations = parseInt(oldTimeWindow / oldGranularity);

    updateForm(
      form
        .updateIn(['granularity'], f => f.setValue(newGranularity).setTouched(true))
        .updateIn(['timeThreshold', 'timeWindow'], f => f.setValue(violations * newGranularity).setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }
}

ConfigureAlertingThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired
};
