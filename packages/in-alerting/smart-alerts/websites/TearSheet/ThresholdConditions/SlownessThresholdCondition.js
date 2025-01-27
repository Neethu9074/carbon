/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';
import { Dropdown } from '@instana/components';

import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
//@ts-expect-error
import { getAggregationValue } from 'in-alerting/smart-alerts/applications/dialog/advanced/thresholdConditionUtil';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/ThresholdTypeSelection';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/dialog/form/ruleForm';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import websiteCreateRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/dialog.mless';

export default function SlownessThresholdCondition({
  form,
  updateForm,
  blueprintConfig,
  editMode,
  // eumType,
  onChartViewConfigChange
}) {
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  // const metricName = form.get('rule').get('metricName').value;

  const resetChartConfigSelectionWhenAdaptiveBaseline = updatedForm => {
    if (isAdaptiveBaselineConfig(updatedForm.get('threshold').toJS())) {
      onChartViewConfigChange(0);
    }
    return updateForm(updatedForm);
  };

  const websiteOnThresholdTypeChange = useOnThresholdTypeChange(websiteCreateRuleForm);

  return (
    // Metric selection
    <>
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
          value={getAggregationValue(form)}
          items={getAggregationOptions(form)}
          className={locals.dropdownsm}
          onChange={value => {
            updateForm(form.updateIn(['rule', 'aggregation'], f => f.setValue(value).setTouched(true)));
          }}
        />
        {/* <AlertTypography variant="body-regular" color="color900" content={blueprintConfig.getMetricLabel(metricName)} />  */}
        {/* TODO add this metric label */}
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
          showThresholdsHint
          eumType={websiteEum}
          isTearSheet
        />
      </Section>

      {/* Threshold Value */}

      <Section
        title={<AlertTypography variant="body-regular" color="color900" content={'Threshold value'} />}
        titleWidth="8rem"
      >
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
      </Section>
    </>
  );
}
