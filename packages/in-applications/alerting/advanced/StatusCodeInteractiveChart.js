/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdValueChanged
} from 'in-applications/alerting/tracker';
import ApplicationAlertingChartWithErrorMessage from 'in-applications/alerting/chart/ApplicationAlertingChartWithErrorMessage';
import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-new-components/Alerting/advanced/ThresholdOperatorDropDown';
import UseSuggestedValueButton from 'in-new-components/Alerting/advanced/UseSuggestedValueButton';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { alertConfigWithDefaultThreshold } from 'in-new-components/Alerting/utils/formUtils';
import ThresholdValueInput from 'in-new-components/Alerting/advanced/ThresholdValueInput';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { getMetricUnitPostfix } from 'in-applications/alerting/form/formUtils';
import Label from 'in-components/form/Label';

import locals from 'in-new-components/Alerting/shared-styles/InteractiveChart.mless';

export default function StatusCodeInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const alertConfig = alertConfigWithDefaultThreshold(form);

  if (!blueprintConfig.isRuleComplete(alertConfig.rule)) {
    return (
      <div className={locals.container}>
        <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
      </div>
    );
  }

  return (
    <div className={locals.container}>
      <ThresholdCondition form={form} onChange={onChange} updateForm={updateForm} blueprintConfig={blueprintConfig} />

      <ChartViewConfigurator
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        className={locals.chartContainer}
        headerTransparent
      >
        {chartViewConfig => (
          <ApplicationAlertingChartWithErrorMessage
            alertConfigWithFormModel={alertConfig}
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

export function ThresholdCondition({ form, onChange, updateForm, blueprintConfig }) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <ThresholdConditionFormGroup>
      <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
      <ThresholdOperatorDropDown
        form={form}
        onChange={onChange}
        trackingCallback={applicationsAlertingThresholdOperatorChanged}
      />
      <ThresholdValueInput
        max={maxValue}
        form={form}
        updateForm={updateForm}
        trackChange={applicationsAlertingThresholdValueChanged}
        metricUnitPostfix={metricUnitPostfix}
      />
      <UseSuggestedValueButton form={form} onChange={onChange} metricUnitPostfix={metricUnitPostfix} />
    </ThresholdConditionFormGroup>
  );
}

StatusCodeInteractiveChart.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
