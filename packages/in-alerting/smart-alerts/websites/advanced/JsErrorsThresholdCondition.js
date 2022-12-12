/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdValueChanged,
  websitesAlertingThresholdMetricChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueWithValidationMessage';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import { getMetricUnitPostfix, isPercentageMetric } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';

export default function JsErrorsThresholdCondition({ form, blueprintConfig, updateForm }) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <ThresholdConditionFormGroup>
      <Dropdown
        value={metricName}
        items={ruleMetricNameOptions.specificJsError}
        onChange={value => {
          updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));
          websitesAlertingThresholdMetricChanged(getTrackingObject(form, { value }));
        }}
      />
      <ThresholdOperatorDropDown
        form={form}
        updateForm={updateForm}
        trackingCallback={websitesAlertingThresholdOperatorChanged}
      />
      <ThresholdValueInputWithValidationMessage
        max={maxValue}
        form={form}
        updateForm={updateForm}
        percentageMetric={percentageMetric}
        trackChange={websitesAlertingThresholdValueChanged}
        metricUnitPostfix={metricUnitPostfix}
      />
      <UseSuggestedValueButton
        form={form}
        updateForm={updateForm}
        metricUnitPostfix={metricUnitPostfix}
        percentageMetric={percentageMetric}
      />
    </ThresholdConditionFormGroup>
  );
}

JsErrorsThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
