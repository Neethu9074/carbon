/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingThresholdMetricChanged,
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdValueChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/smart-alert-dialog/IncompleteChartPlaceholder';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator';
import { isPercentageMetric, getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { alertConfigWithDefaultThreshold } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/InteractiveChart.mless';

export default function StatusCodeInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const alertConfigWithFormModel = alertConfigWithDefaultThreshold(form);

  if (!blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule)) {
    return (
      <div className={locals.container}>
        <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
      </div>
    );
  }

  return (
    <div className={locals.container}>
      <ThresholdCondition form={form} onChange={onChange} blueprintConfig={blueprintConfig} updateForm={updateForm} />

      <ChartViewConfigurator
        alertConfigWithFormModel={alertConfigWithFormModel}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        headerTransparent
      >
        {chartViewConfig => (
          <WebsitesAlertingChartWithErrorMessage
            alertConfigWithFormModel={alertConfigWithFormModel}
            viewConfig={chartViewConfig}
            blueprintConfig={blueprintConfig}
            alertsPreviewEnabled
            canReload
          />
        )}
      </ChartViewConfigurator>
    </div>
  );
}

export function ThresholdCondition({ form, onChange, blueprintConfig, updateForm }) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <ThresholdConditionFormGroup>
      <Dropdown
        asSimpleDropdown
        label={blueprintConfig.getMetricLabel(metricName)}
        items={ruleMetricNameOptions.statusCode}
        onChange={({ value = '' }) => {
          updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));

          websitesAlertingThresholdMetricChanged(getTrackingObject(form, { value }));
        }}
      />
      <ThresholdOperatorDropDown
        form={form}
        onChange={onChange}
        trackingCallback={websitesAlertingThresholdOperatorChanged}
      />
      <ThresholdValueInput
        className={locals.narrowControl}
        max={maxValue}
        form={form}
        updateForm={updateForm}
        trackChange={websitesAlertingThresholdValueChanged}
        percentageMetric={percentageMetric}
        metricUnitPostfix={metricUnitPostfix}
      />
      <UseSuggestedValueButton
        form={form}
        onChange={onChange}
        percentageMetric={percentageMetric}
        metricUnitPostfix={metricUnitPostfix}
      />
    </ThresholdConditionFormGroup>
  );
}

StatusCodeInteractiveChart.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  updateForm: PropTypes.func.isRequired
};
