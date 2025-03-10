/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import PropTypes from 'prop-types';
import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';
import { Spacer } from '@instana/components';
import { Stack } from '@instana/components';

import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/tearSheet/MultiThresholdCondition/MultiThresholdDeviationSliderForm';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import MultiThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/Section/MultiThresholdCondition';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdTypeSelection';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import mobileAppCreateRuleForm from 'in-alerting/smart-alerts/mobileApp/form/ruleForm';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import websiteCreateRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertTypography from 'in-alerting/components/AlertTypography';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdCondition.mless';

export default function ThroughputThresholdCondition({
  form,
  updateForm,
  blueprintConfig,
  editMode,
  eumType,
  ruleMetricNameOptions,
  getMetricUnitPostfix,
  onChartViewConfigChange,
  children
}) {
  const metricName = form.get('rule').get('metricName').value;
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  const resetChartConfigSelectionWhenAdaptiveBaseline = updatedForm => {
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
          items={ruleMetricNameOptions.throughput}
          className={locals.dropdownmd}
          onChange={value => {
            updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));
          }}
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
          onThresholdTypeChange={eumType === websiteEum ? websiteOnThresholdTypeChange : mobileAppOnThresholdTypeChange}
          isTearSheet
        />
        <Spacer size="medium" />
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

ThroughputThresholdCondition.propTypes = {
  blueprintConfig: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  eumType: PropTypes.string.isRequired,
  ruleMetricNameOptions: PropTypes.object.isRequired,
  getMetricUnitPostfix: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  children: PropTypes.object
};
