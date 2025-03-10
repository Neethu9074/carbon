/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactNode } from 'react';
import { MapForm } from 'formalistic';

import { isAdaptiveBaselineConfig } from '@instana/types';
import { Spacer } from '@instana/components';
import { Stack } from '@instana/components';

import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/tearSheet/MultiThresholdCondition/MultiThresholdDeviationSliderForm';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import MultiThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/Section/MultiThresholdCondition';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdTypeSelection';
import { BluePrint as MobileAppBlueprint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { BluePrint as WebsiteBlueprint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import mobileAppCreateRuleForm from 'in-alerting/smart-alerts/mobileApp/form/ruleForm';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import websiteCreateRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
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
  children?: ReactNode;
}

export default function CustomEventsThresholdCondition({
  form,
  blueprintConfig,
  updateForm,
  editMode,
  eumType,
  getMetricUnitPostfix,
  isPercentageMetric,
  onChartViewConfigChange,
  children
}: CustomEventsThresholdConditionProps) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdType = form.get('threshold').get('warningThreshold').get('type')?.value;
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();

  const resetChartConfigSelectionWhenAdaptiveBaseline = (updatedForm: MapForm<any>) => {
    if (isAdaptiveBaselineConfig(updatedForm.get('threshold').toJS())) {
      onChartViewConfigChange(0);
    }
    return updateForm(updatedForm);
  };

  const websiteOnThresholdTypeChange = useOnThresholdTypeChange(websiteCreateRuleForm);
  const mobileAppOnThresholdTypeChange = useOnThresholdTypeChange(mobileAppCreateRuleForm);

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
        <AlertTypography variant="body-bold" content={blueprintConfig.getMetricLabel(metricName)} />
      </Section>

      {/* Threshold Type */}
      <Section
        title={
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.websites.advanced.thresholdValue')}
          />
        }
        titleWidth="8rem"
      >
        <StaticOrAdaptiveSwitch
          form={form}
          setForm={resetChartConfigSelectionWhenAdaptiveBaseline}
          onThresholdTypeChange={eumType === websiteEum ? websiteOnThresholdTypeChange : mobileAppOnThresholdTypeChange}
          isTearSheet
        />
        <Spacer size="xsmall" />
        {children}
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
        title={
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.websites.advanced.thresholdValue')}
          />
        }
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
