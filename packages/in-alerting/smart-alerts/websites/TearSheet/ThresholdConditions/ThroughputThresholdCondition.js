/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import PropTypes from 'prop-types';
import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';
import { Spacer } from '@instana/components';

import ThresholdValueFormGroupForStaticThreshold from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/ThresholdValueFormGroupForStaticThreshold';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/ThresholdDeviationSliderForm';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdTypeSelection';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import websiteCreateRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertTypography from 'in-alerting/components/AlertTypography';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/dialog.mless';

export default function ThroughputThresholdCondition({
  form,
  updateForm,
  blueprintConfig,
  editMode,
  eumType,
  ruleMetricNameOptions,
  getMetricUnitPostfix,
  onChartViewConfigChange
}) {
  const metricName = form.get('rule').get('metricName').value;
  const thresholdType = form.get('threshold').get('type')?.value;
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
            label={t('in-alerting:smartAlerts.websites.advanced.thresholdValue')}
            isTearSheet
          />
        )}

        <Spacer size="normal" />

        {/* Threshold deviation slider */}
        {thresholdType !== STATIC_THRESHOLD && (
          <ThresholdDeviationSliderForm
            form={form}
            updateForm={updateForm}
            defaultValue={defaultDeviationFactor}
            isTearSheet
          />
        )}
      </Section>
    </>
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
  onChartViewConfigChange: PropTypes.func.isRequired
};
