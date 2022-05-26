/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
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
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { websitesAlertingThresholdMetricChanged } from 'in-alerting/smart-alerts/websites/tracker';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { isPercentageMetric } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Dropdown from 'in-alerting/components/Dropdown';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/ThresholdCondition.mless';

export default function JsErrorsThresholdCondition({ form, blueprintConfig, updateForm }) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdField = form.get('threshold').get('value');

  return (
    <ThresholdConditionFormGroup>
      <Dropdown
        asSimpleDropdown
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

JsErrorsThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
