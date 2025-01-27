/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';
import { Spacer } from '@instana/components';

import ThresholdValueFormGroupForStaticThreshold from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/ThresholdValueFormGroupForStaticThreshold';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/ThresholdDeviationSliderForm';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdTypeSelection';
import { BluePrint as MobileAppBlueprint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { BluePrint as WebsiteBlueprint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import websiteCreateRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

interface CustomEventsThresholdConditionProps {
  form: MapForm<any>;
  blueprintConfig: WebsiteBlueprint | MobileAppBlueprint;
  updateForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  eumType: string;
  getMetricUnitPostfix: (arg: string) => string;
  isPercentageMetric: (arg: string) => boolean;
  onChartViewConfigChange: (arg: number) => void;
}

export default function CustomEventsThresholdCondition({
  form,
  blueprintConfig,
  updateForm,
  editMode,
  eumType,
  getMetricUnitPostfix,
  isPercentageMetric,
  onChartViewConfigChange
}: CustomEventsThresholdConditionProps) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdType = form.get('threshold').get('type')?.value;
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();

  const resetChartConfigSelectionWhenAdaptiveBaseline = (updatedForm: any) => {
    if (isAdaptiveBaselineConfig(updatedForm.get('threshold').toJS())) {
      onChartViewConfigChange(0);
    }
    return updateForm(updatedForm);
  };

  const websiteOnThresholdTypeChange = useOnThresholdTypeChange(websiteCreateRuleForm);

  return (
    <>
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
        <AlertTypography variant="body-bold" content={blueprintConfig.getMetricLabel(metricName)} />
      </Section>

      {/* Threshold Type */}
      <Section
        title={<AlertTypography variant="body-regular" color="color900" content={'Threshold Type'} />}
        titleWidth="8rem"
      >
        <StaticOrAdaptiveSwitch
          form={form}
          setForm={resetChartConfigSelectionWhenAdaptiveBaseline}
          onThresholdTypeChange={websiteOnThresholdTypeChange}
          isTearSheet
        />
        <ThresholdTypeSelection
          form={form}
          updateForm={updateForm}
          editMode={editMode}
          thresholdTypeOptions={thresholdTypeOptions}
          eumType={eumType}
        />
      </Section>

      {/* Threshold Value */}

      <Section
        title={<AlertTypography variant="body-regular" color="color900" content={'Threshold value'} />}
        titleWidth="8rem"
      >
        {/* Threshold operator */}
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />

        <Spacer size="medium" />

        {/* Threshold type */}
        {thresholdType === STATIC_THRESHOLD && (
          <ThresholdValueFormGroupForStaticThreshold
            form={form}
            updateForm={updateForm}
            maxValue={maxValue}
            metricUnitPostfix={metricUnitPostfix}
            percentageMetric={percentageMetric}
          />
        )}

        <Spacer size="normal" />

        {/* Threshold deviation slider */}
        {thresholdType !== STATIC_THRESHOLD && (
          <ThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
        )}
      </Section>
    </>
  );
}
