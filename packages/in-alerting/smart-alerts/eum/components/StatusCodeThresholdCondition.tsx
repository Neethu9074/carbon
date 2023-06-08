/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

//@ts-expect-error TS migration
import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
//@ts-expect-error TS migration
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
//@ts-expect-error TS migration
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
//@ts-expect-error TS migration
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/dialog/advanced/UseSuggestedValueButton';
import { BluePrint as MobileAppBluePrint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { BluePrint as WebsiteBluePrint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import { Option } from 'in-components/ComboBox';

interface StatusCodeThresholdConditionProps {
  form: MapForm<any>;
  blueprintConfig: MobileAppBluePrint | WebsiteBluePrint;
  updateForm: (form: MapForm<any>) => void;
  eumType: string;
  getMetricUnitPostfix: (arg: string) => string;
  isPercentageMetric: (arg: string) => boolean;
  ruleMetricNameOptions: {
    statusCode: Option[];
  };
}

export default function StatusCodeThresholdCondition({
  form,
  blueprintConfig,
  updateForm,
  eumType,
  getMetricUnitPostfix,
  isPercentageMetric,
  ruleMetricNameOptions
}: StatusCodeThresholdConditionProps) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <ThresholdConditionFormGroup>
      <Dropdown
        value={metricName}
        items={ruleMetricNameOptions.statusCode}
        onChange={value => {
          updateForm(form.updateIn(['rule', 'metricName'], f => (f as Field<any>).setValue(value).setTouched(true)));
        }}
      />
      <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
      <ThresholdValueInputWithValidationMessage
        max={maxValue}
        form={form}
        updateForm={updateForm}
        percentageMetric={percentageMetric}
        metricUnitPostfix={metricUnitPostfix}
        isSmall
      />
      {/* eumType === websiteEum , this condition need to be removed once useSuggestion is implemented for mobileapp  */}
      {eumType === websiteEum && (
        <UseSuggestedValueButton
          form={form}
          updateForm={updateForm}
          percentageMetric={percentageMetric}
          metricUnitPostfix={metricUnitPostfix}
        />
      )}
    </ThresholdConditionFormGroup>
  );
}
