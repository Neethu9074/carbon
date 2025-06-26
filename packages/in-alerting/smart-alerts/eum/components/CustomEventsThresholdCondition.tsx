/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import ThresholdValueFormGroupForMultiStaticThreshold from 'in-alerting/smart-alerts/dialog/advanced/ThresholdValueFormGroupForMultiStaticThreshold';
import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/dialog/advanced/MultiThresholdDeviationSliderForm';
//@ts-expect-error
import { getAggregationValue } from 'in-alerting/smart-alerts/applications/dialog/advanced/thresholdConditionUtil';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { BluePrint as MobileAppBlueprint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { BluePrint as WebsiteBlueprint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/ThresholdTypeSelection';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/dialog/form/ruleForm';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { eumSmartAlertCustomMetricsEnabled } from 'in-services/featureFlags';
import Dropdown from 'in-alerting/components/Dropdown';
import { Option } from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/CustomEventsThresholdCondition.mless';

interface CustomEventsThresholdConditionProps {
  form: MapForm<any>;
  blueprintConfig: WebsiteBlueprint | MobileAppBlueprint;
  updateForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  eumType: string;
  getMetricUnitPostfix: (arg: string) => string;
  isPercentageMetric: (arg: string) => boolean;
  ruleMetricNameOptions: {
    customEvent: Option[];
  };
}

export default function CustomEventsThresholdCondition({
  form,
  blueprintConfig,
  updateForm,
  editMode,
  eumType,
  getMetricUnitPostfix,
  isPercentageMetric,
  ruleMetricNameOptions
}: CustomEventsThresholdConditionProps) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdType = form.get('threshold').get('warningThreshold').get('type')?.value;
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  return (
    <>
      <ThresholdConditionFormGroup>
        {eumSmartAlertCustomMetricsEnabled ? (
          <>
            <Dropdown
              value={metricName}
              items={ruleMetricNameOptions.customEvent}
              className={locals.dropdownmd}
              onChange={value => {
                let updatedForm = form.updateIn(['rule', 'metricName'], f =>
                  (f as Field<any>).setValue(value).setTouched(true)
                );

                if (value === 'beaconCount') {
                  updatedForm = updatedForm.updateIn(['rule', 'aggregation'], f =>
                    (f as Field<any>).setValue('SUM').setTouched(true)
                  );
                }

                updateForm(updatedForm);
              }}
            />
            {metricName !== 'beaconCount' && (
              <Dropdown
                value={getAggregationValue(form)}
                //@ts-expect-error
                items={getAggregationOptions(form)}
                className={locals.dropdownsm}
                onChange={value => {
                  updateForm(
                    form.updateIn(['rule', 'aggregation'], f => (f as Field<any>).setValue(value).setTouched(true))
                  );
                }}
              />
            )}
          </>
        ) : (
          <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
        )}

        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />

        <ThresholdTypeSelection
          form={form}
          updateForm={updateForm}
          editMode={editMode}
          thresholdTypeOptions={thresholdTypeOptions}
          eumType={eumType}
        />
      </ThresholdConditionFormGroup>

      {thresholdType === STATIC_THRESHOLD && (
        <ThresholdValueFormGroupForMultiStaticThreshold
          form={form}
          updateForm={updateForm}
          maxValue={maxValue}
          percentageMetric={percentageMetric}
          metricUnitPostfix={metricUnitPostfix}
          label={t('in-alerting:smartAlerts.eum.advanced.thresholdValue')}
        />
      )}
      {thresholdType !== STATIC_THRESHOLD && (
        <MultiThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
      )}
    </>
  );
}
