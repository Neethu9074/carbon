/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Dropdown, Spacer, Stack } from '@instana/components';
import { isAdaptiveBaselineConfig } from '@instana/types';

import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/tearSheet/MultiThresholdCondition/MultiThresholdDeviationSliderForm';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import MultiThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/Section/MultiThresholdCondition';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdTypeSelection';
import { BluePrint as MobileAppBlueprint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/mobileApp/form/ruleFormData';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import mobileAppCreateRuleForm from 'in-alerting/smart-alerts/mobileApp/form/ruleForm';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/dialog.mless';

interface CrashThresholdConditionProps {
  form: MapForm<any>;
  blueprintConfig: MobileAppBlueprint;
  updateForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  getMetricUnitPostfix: (arg: string) => string;
  isPercentageMetric: (arg: string) => boolean;
  onChartViewConfigChange: (arg: number) => void;
}

export default function CrashThresholdCondition({
  form,
  blueprintConfig,
  updateForm,
  editMode,
  getMetricUnitPostfix,
  isPercentageMetric,
  onChartViewConfigChange
}: CrashThresholdConditionProps) {
  const metricName = form.get('rule').get('metricName').value;

  const resetChartConfigSelectionWhenAdaptiveBaseline = (updatedForm: MapForm<any>) => {
    if (isAdaptiveBaselineConfig(updatedForm.get('threshold').toJS())) {
      onChartViewConfigChange(0);
    }
    return updateForm(updatedForm);
  };

  const mobileAppOnThresholdTypeChange = useOnThresholdTypeChange(mobileAppCreateRuleForm);

  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);

  const thresholdType = form.get('threshold').get('warningThreshold').get('type')?.value;

  return (
    <Stack gap="medium">
      {/* metric dropdown */}
      <Section
        title={
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.details.metricTitle')}
          />
        }
        titleWidth="8rem"
      >
        <Dropdown
          value={metricName}
          items={ruleMetricNameOptions.crash}
          className={locals.dropdownxxlg}
          onChange={value => {
            updateForm(form.updateIn(['rule', 'metricName'], f => (f as Field<any>).setValue(value).setTouched(true)));
          }}
          size="sm"
        />
      </Section>

      {/* Threshold Type */}
      <Section
        title={<AlertTypography variant="body-regular" color="color900" content={'Threshold Type'} />}
        titleWidth="8rem"
      >
        <StaticOrAdaptiveSwitch
          form={form}
          setForm={resetChartConfigSelectionWhenAdaptiveBaseline}
          onThresholdTypeChange={mobileAppOnThresholdTypeChange}
          isTearSheet
        />
        <Spacer size="xsmall" />
        <ThresholdTypeSelection
          form={form}
          updateForm={updateForm}
          editMode={editMode}
          thresholdTypeOptions={thresholdTypeOptions}
          eumType={mobileAppEum}
        />
      </Section>

      {/* Threshold Value */}

      <Section
        title={<AlertTypography variant="body-regular" color="color900" content={'Threshold value'} />}
        titleWidth="8rem"
      >
        {/* Threshold type */}
        {thresholdType === STATIC_THRESHOLD && (
          <MultiThresholdCondition
            form={form}
            updateForm={updateForm}
            max={maxValue}
            metricUnitPostfix={metricUnitPostfix}
            percentageMetric={percentageMetric}
          />
        )}

        {/* Threshold deviation slider */}
        {thresholdType !== STATIC_THRESHOLD && (
          <MultiThresholdDeviationSliderForm
            form={form}
            updateForm={updateForm}
            defaultValue={defaultDeviationFactor}
          />
        )}
      </Section>
    </Stack>
  );
}
