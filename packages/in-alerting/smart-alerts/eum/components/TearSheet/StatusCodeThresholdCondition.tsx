/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';
import { Spacer, Stack } from '@instana/components';

import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/tearSheet/MultiThresholdCondition/MultiThresholdDeviationSliderForm';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import MultiThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/Section/MultiThresholdCondition';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdTypeSelection';
import { BluePrint as MobileAppBluePrint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { BluePrint as WebsiteBluePrint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import mobileAppCreateRuleForm from 'in-alerting/smart-alerts/mobileApp/form/ruleForm';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import websiteCreateRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertTypography from 'in-alerting/components/AlertTypography';
import Dropdown from 'in-alerting/components/Dropdown';
import { Option } from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdCondition.mless';

interface StatusCodeThresholdConditionProps {
  form: MapForm<any>;
  blueprintConfig: MobileAppBluePrint | WebsiteBluePrint;
  updateForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  eumType: string;
  getMetricUnitPostfix: (arg: string) => string;
  isPercentageMetric: (arg: string) => boolean;
  ruleMetricNameOptions: {
    statusCode: Option[];
  };
  onChartViewConfigChange: (arg: number) => void;
}

export default function StatusCodeThresholdCondition({
  form,
  blueprintConfig,
  updateForm,
  editMode,
  eumType,
  getMetricUnitPostfix,
  isPercentageMetric,
  ruleMetricNameOptions,
  onChartViewConfigChange
}: StatusCodeThresholdConditionProps) {
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
        <Dropdown
          value={metricName}
          items={ruleMetricNameOptions.statusCode}
          className={locals.dropdownxlg}
          onChange={value => {
            updateForm(form.updateIn(['rule', 'metricName'], f => (f as Field<any>).setValue(value).setTouched(true)));
          }}
        />
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
