/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import {
  websitesAlertingThresholdDeviationFactorChanged,
  websitesAlertingThresholdMetricChanged,
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdTypeChanged,
  websitesAlertingThresholdValueChanged
} from 'in-websites/alerting/tracker';
import { ThresholdDeviationSliderForm } from 'in-new-components/Alerting/advanced/ThresholdDeviationSliderForm';
import { findEntryByValue, alertConfigWithDefaultValues } from 'in-new-components/Alerting/utils/formUtils';
import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-new-components/Alerting/advanced/ThresholdOperatorDropDown';
import createThresholdForm, { defaultDeviationFactor } from 'in-websites/alerting/form/thresholdForm';
import { getThresholdComboBoxValue } from 'in-new-components/Alerting/advanced/thresholdFormHelper';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { thresholdTypeOptions } from 'in-new-components/Alerting/advanced/thresholdFormData';
import ThresholdValueInput from 'in-new-components/Alerting/advanced/ThresholdValueInput';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { ruleMetricNameOptions } from 'in-websites/alerting/form/ruleFormData';
import { getMetricUnitPostfix } from 'in-websites/alerting/form/formUtils';
import createRuleForm from 'in-websites/alerting/form/ruleForm';
import Dropdown from 'in-new-components/Alerting/Dropdown';

import locals from 'in-new-components/Alerting/shared-styles/InteractiveChart.mless';

export default function ThroughputInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const alertConfig = alertConfigWithDefaultValues(form);

  return (
    <div className={locals.container}>
      <ThresholdCondition form={form} updateForm={updateForm} onChange={onChange} blueprintConfig={blueprintConfig} />

      <ChartViewConfigurator
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        className={locals.chartContainer}
        headerTransparent
      >
        {chartViewConfig => (
          <AlertingChartWithErrorMessage
            alertConfig={alertConfig}
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

function ThresholdCondition({ form, updateForm, onChange, blueprintConfig }) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <>
      <ThresholdConditionFormGroup>
        <Dropdown
          asSimpleDropdown
          label={blueprintConfig.getMetricLabel(metricName)}
          items={ruleMetricNameOptions.throughput}
          onChange={({ value = '' }) => {
            updateForm(
              form
                .updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true))
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
                .updateIn(['threshold', thresholdType === 'historicBaseline' ? 'baseline' : 'value'], f =>
                  f.setValue(null).setTouched(true)
                )
            );
            websitesAlertingThresholdMetricChanged(getTrackingObject(form, { value }));
          }}
        />
        <ThresholdOperatorDropDown
          form={form}
          customOnChange={newOperator => {
            let updatedForm = form.updateIn(['threshold', 'operator'], f => f.setValue(newOperator).setTouched(true));
            if (thresholdType === 'staticThreshold') {
              // if the operator direction changed in case of static-threshold: request new suggestion
              updatedForm = updatedForm.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f =>
                f.setValue(true)
              );
            }
            updateForm(updatedForm);
          }}
          trackingCallback={websitesAlertingThresholdOperatorChanged}
          allOptions
        />
        <Dropdown
          asSimpleDropdown
          name="thresholdType"
          label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
          items={thresholdTypeOptions}
          onChange={e => {
            const newThresholdTypeWithSeasonality = (e && e.value) || '';
            const valueParts = newThresholdTypeWithSeasonality.split('.');
            const newThresholdType = valueParts[0];

            let newThresholdForm = createThresholdForm(
              {
                ...form.get('threshold').toJS(),
                type: newThresholdType,
                value: null, // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
                baseline: null
              },
              form.get('rule').get('alertType').value
            );

            if (valueParts.length > 1) {
              const newSeasonality = valueParts[1];
              newThresholdForm = newThresholdForm.updateIn(['seasonality'], f =>
                f.setValue(newSeasonality).setTouched()
              );
            }

            const newRuleForm = createRuleForm({ ...form.get('rule').toJS(), aggregation: null }); // reset to default value (happens in createRuleForm)

            updateForm(
              form
                .put('threshold', newThresholdForm)
                .put('rule', newRuleForm)
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
            );

            websitesAlertingThresholdTypeChanged(getTrackingObject(form, { value: newThresholdType }));
          }}
          defaultValue="staticThreshold"
        />
      </ThresholdConditionFormGroup>
      {thresholdType === 'staticThreshold' && (
        <ThresholdConditionFormGroup iconType="lib_threshold" label={t('in-websites:alerting.advanced.thresholdValue')}>
          <ThresholdValueInput
            max={maxValue}
            form={form}
            onChange={onChange}
            trackChange={websitesAlertingThresholdValueChanged}
            metricUnitPostfix={metricUnitPostfix}
          />
        </ThresholdConditionFormGroup>
      )}

      {thresholdType !== 'staticThreshold' && (
        <ThresholdDeviationSliderForm
          form={form}
          onChange={onChange}
          trackChange={websitesAlertingThresholdDeviationFactorChanged}
          defaultValue={defaultDeviationFactor}
        />
      )}
    </>
  );
}

ThroughputInteractiveChart.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
