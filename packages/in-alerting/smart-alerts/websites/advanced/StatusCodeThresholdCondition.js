/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingThresholdMetricChanged,
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdValueChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import { isPercentageMetric, getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/InteractiveChart.mless';

export default function StatusCodeThresholdCondition({ form, onChange, blueprintConfig, updateForm }) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <ThresholdConditionFormGroup>
      <Dropdown
        asSimpleDropdown
        label={blueprintConfig.getMetricLabel(metricName)}
        items={ruleMetricNameOptions.statusCode}
        onChange={({ value = '' }) => {
          updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));

          websitesAlertingThresholdMetricChanged(getTrackingObject(form, { value }));
        }}
      />
      <ThresholdOperatorDropDown
        form={form}
        onChange={onChange}
        trackingCallback={websitesAlertingThresholdOperatorChanged}
      />
      <ThresholdValueInput
        className={locals.narrowControl}
        max={maxValue}
        form={form}
        updateForm={updateForm}
        trackChange={websitesAlertingThresholdValueChanged}
        percentageMetric={percentageMetric}
        metricUnitPostfix={metricUnitPostfix}
      />
      <UseSuggestedValueButton
        form={form}
        onChange={onChange}
        percentageMetric={percentageMetric}
        metricUnitPostfix={metricUnitPostfix}
      />
    </ThresholdConditionFormGroup>
  );
}

StatusCodeThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired
};
