/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdValueChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { isPercentageMetric } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Label from 'in-components/form/Label';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/ThresholdCondition.mless';

export default function CustomEventsThresholdCondition({ form, blueprintConfig, updateForm }) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdField = form.get('threshold').get('value');

  return (
    <ThresholdConditionFormGroup>
      <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
      <ThresholdOperatorDropDown
        form={form}
        updateForm={updateForm}
        trackingCallback={websitesAlertingThresholdOperatorChanged}
        allOptions
      />
      <div className={locals.thresholdValueWithValidationMessage}>
        <ThresholdValueInput
          max={maxValue}
          form={form}
          updateForm={updateForm}
          percentageMetric={percentageMetric}
          trackChange={websitesAlertingThresholdValueChanged}
          metricUnitPostfix={metricUnitPostfix}
        />
        <TouchedMessages field={thresholdField} />
      </div>

      <UseSuggestedValueButton
        form={form}
        updateForm={updateForm}
        metricUnitPostfix={metricUnitPostfix}
        percentageMetric={percentageMetric}
      />
    </ThresholdConditionFormGroup>
  );
}

CustomEventsThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
