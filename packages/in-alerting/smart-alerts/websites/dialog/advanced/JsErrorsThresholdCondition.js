/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import ThresholdValueFormGroupForMultiStaticThreshold from 'in-alerting/smart-alerts/dialog/advanced/ThresholdValueFormGroupForMultiStaticThreshold';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { getMetricUnitPostfix, isPercentageMetric } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/dialog.mless';

export default function JsErrorsThresholdCondition({ form, blueprintConfig, updateForm }) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <>
      <ThresholdConditionFormGroup>
        <Dropdown
          value={metricName}
          items={ruleMetricNameOptions.specificJsError}
          className={locals.dropdownmd}
          onChange={value => {
            updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));
          }}
        />
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
      </ThresholdConditionFormGroup>

      <ThresholdValueFormGroupForMultiStaticThreshold
        form={form}
        updateForm={updateForm}
        maxValue={maxValue}
        percentageMetric={percentageMetric}
        metricUnitPostfix={metricUnitPostfix}
      />
    </>
  );
}

JsErrorsThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
