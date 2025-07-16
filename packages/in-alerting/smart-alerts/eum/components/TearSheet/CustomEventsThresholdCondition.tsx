/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm, Field } from 'formalistic';
import React, { ReactNode } from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';
import { Spacer } from '@instana/components';
import { Stack } from '@instana/components';

import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/tearSheet/MultiThresholdCondition/MultiThresholdDeviationSliderForm';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
//@ts-expect-error
import { getMetricLabelValue } from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/MetricDropdown';
//@ts-expect-error
import { getAggregationValue } from 'in-alerting/smart-alerts/applications/dialog/advanced/thresholdConditionUtil';
import MultiThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/Section/MultiThresholdCondition';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdTypeSelection';
import { BluePrint as MobileAppBlueprint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { BluePrint as WebsiteBlueprint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/dialog/form/ruleForm';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { eumSmartAlertCustomMetricsEnabled } from 'in-services/featureFlags';
import { getTitleWidth } from 'in-alerting/smart-alerts/eum/data/utils';
import AlertTypography from 'in-alerting/components/AlertTypography';
import Dropdown from 'in-alerting/components/Dropdown';
import { Option } from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdCondition.mless';

interface CustomEventsThresholdConditionProps {
  form: MapForm<any>;
  blueprintConfig: WebsiteBlueprint | MobileAppBlueprint;
  updateForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  eumType: string;
  getMetricUnitPostfix: (arg: string) => string;
  isPercentageMetric: (arg: string) => boolean;
  onChartViewConfigChange: (arg: number) => void;
  alertChannelPerSeverityEnabled: boolean;
  children?: ReactNode;
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
  onChartViewConfigChange,
  alertChannelPerSeverityEnabled,
  children,
  ruleMetricNameOptions
}: CustomEventsThresholdConditionProps) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdType = form.get('threshold').get('warningThreshold').get('type')?.value;
  const onThresholdTypeChange = useOnThresholdTypeChange();
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();

  const resetChartConfigSelectionWhenAdaptiveBaseline = (updatedForm: MapForm<any>) => {
    if (isAdaptiveBaselineConfig(updatedForm.get('threshold').toJS())) {
      onChartViewConfigChange(0);
    }
    return updateForm(updatedForm);
  };

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
        titleWidth={getTitleWidth()}
      >
        {eumSmartAlertCustomMetricsEnabled ? (
          <Stack direction="horizontal" gap="xsmall">
            <Dropdown
              value={metricName}
              items={ruleMetricNameOptions.customEvent}
              className={locals.smallWidth}
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
                className={locals.dropdownxlg}
                items={getAggregationOptions(form).map(item => ({
                  value: item.value,
                  label: getMetricLabelValue(item.label)
                }))}
                onChange={value => {
                  updateForm(
                    form.updateIn(['rule', 'aggregation'], f => (f as Field<any>).setValue(value).setTouched(true))
                  );
                }}
              />
            )}
          </Stack>
        ) : (
          <AlertTypography variant="body-bold" content={blueprintConfig.getMetricLabel(metricName)} />
        )}
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
        titleWidth={getTitleWidth()}
      >
        <StaticOrAdaptiveSwitch
          form={form}
          setForm={resetChartConfigSelectionWhenAdaptiveBaseline}
          onThresholdTypeChange={onThresholdTypeChange}
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
        titleWidth={getTitleWidth()}
      >
        {/* Threshold type */}
        {thresholdType === STATIC_THRESHOLD && (
          <MultiThresholdCondition
            form={form}
            updateForm={updateForm}
            max={maxValue}
            metricUnitPostfix={metricUnitPostfix}
            percentageMetric={percentageMetric}
            alertChannelPerSeverityEnabled={alertChannelPerSeverityEnabled}
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
