/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdValueChanged
} from 'in-websites/alerting/tracker';
import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-new-components/Alerting/advanced/ThresholdOperatorDropDown';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { alertConfigWithDefaultThreshold } from 'in-new-components/Alerting/utils/formUtils';
import ThresholdValueInput from 'in-new-components/Alerting/advanced/ThresholdValueInput';
import { websitesAlertingThresholdMetricChanged } from 'in-websites/alerting/tracker';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { ruleMetricNameOptions } from 'in-websites/alerting/form/ruleFormData';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { getMetricUnitPostfix } from 'in-websites/alerting/form/formUtils';
import { isPercentageMetric } from 'in-websites/alerting/form/formUtils';
import Dropdown from 'in-new-components/Alerting/Dropdown';

import locals from 'in-new-components/Alerting/shared-styles/InteractiveChart.mless';

export default function JsErrorsInteractiveChart({
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
      <ThresholdCondition form={form} onChange={onChange} blueprintConfig={blueprintConfig} updateForm={updateForm} />

      <ChartViewConfigurator
        alertConfig={alertConfig}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        headerTransparent
      >
        {chartViewConfig => (
          <AlertingChartWithErrorMessage
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
        items={ruleMetricNameOptions.specificJsError}
        onChange={({ value = '' }) => {
          updateForm(
            form
              .updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true))
              .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              .updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true)) // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
          );
          websitesAlertingThresholdMetricChanged(getTrackingObject(form, { value }));
        }}
      />
      <ThresholdOperatorDropDown
        form={form}
        onChange={onChange}
        trackingCallback={websitesAlertingThresholdOperatorChanged}
      />
      <ThresholdValueInput
        max={maxValue}
        form={form}
        onChange={onChange}
        percentageMetric={percentageMetric}
        trackChange={websitesAlertingThresholdValueChanged}
        metricUnitPostfix={metricUnitPostfix}
      />
    </ThresholdConditionFormGroup>
  );
}

JsErrorsInteractiveChart.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
