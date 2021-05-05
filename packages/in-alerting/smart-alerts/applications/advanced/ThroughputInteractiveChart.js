/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdTypeChanged,
  applicationsAlertingThresholdDeviationFactorChanged,
  applicationsAlertingThresholdValueChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdDeviationSliderForm';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { createThroughputForm, defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import { findEntryByValue, alertConfigWithDefaultValues } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/InteractiveChart.mless';

export default function ThroughputInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  isGlobalSmartAlert,
  editMode
}) {
  const alertConfigWithFormModel = alertConfigWithDefaultValues(form);

  return (
    <div className={locals.container}>
      <ThresholdCondition
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        blueprintConfig={blueprintConfig}
        editMode={editMode}
        isGlobalSmartAlert={isGlobalSmartAlert}
      />

      <ChartViewConfiguratorWithEntitySelection
        alertConfigWithFormModel={alertConfigWithFormModel}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        headerTransparent
      >
        {(chartViewConfig, applicationId, serviceId, endpointId) => (
          <ApplicationAlertingChartWithErrorMessage
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            alertConfigWithFormModel={alertConfigWithFormModel}
            viewConfig={chartViewConfig}
            blueprintConfig={blueprintConfig}
            alertsPreviewEnabled
            canReload
          />
        )}
      </ChartViewConfiguratorWithEntitySelection>
    </div>
  );
}

function ThresholdCondition({ form, updateForm, onChange, blueprintConfig, editMode, isGlobalSmartAlert }) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const canSelectBaseline = form.get('evaluationType').value === PER_AP && !isGlobalSmartAlert;

  return (
    <>
      <ThresholdConditionFormGroup>
        <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
        <ThresholdOperatorDropDown
          form={form}
          customOnChange={newOperator => {
            updateForm(form.updateIn(['threshold', 'operator'], f => f.setValue(newOperator).setTouched(true)));
          }}
          trackingCallback={applicationsAlertingThresholdOperatorChanged}
          allOptions
        />
        {canSelectBaseline ? (
          <>
            <Dropdown
              asSimpleDropdown
              label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
              items={thresholdTypeOptions}
              onChange={e => {
                const newThresholdTypeWithSeasonality = (e && e.value) || '';
                const valueParts = newThresholdTypeWithSeasonality.split('.');
                const newThresholdType = valueParts[0];

                let newThresholdForm = createThroughputForm({
                  ...form.get('threshold').toJS(),
                  type: newThresholdType
                });

                if (valueParts.length > 1) {
                  const newSeasonality = valueParts[1];
                  newThresholdForm = newThresholdForm.updateIn(['seasonality'], f =>
                    f.setValue(newSeasonality).setTouched()
                  );
                }

                const newRuleForm = createRuleForm({ ...form.get('rule').toJS(), aggregation: null }); // reset to default value (happens in createRuleForm)

                updateForm(form.put('threshold', newThresholdForm).put('rule', newRuleForm));

                applicationsAlertingThresholdTypeChanged(getTrackingObject(form, { value: newThresholdType }));
              }}
            />
            {thresholdType === 'historicBaseline' && (
              <RecalculateBaselineButton onChange={onChange} editMode={editMode} form={form} />
            )}
          </>
        ) : (
          <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')}</div>
        )}
      </ThresholdConditionFormGroup>

      {thresholdType === 'staticThreshold' && (
        <ThresholdConditionFormGroup iconType="lib_threshold" label={t('in-applications:alert.thresholdLabel')}>
          <ThresholdValueInput
            max={maxValue}
            form={form}
            updateForm={updateForm}
            trackChange={applicationsAlertingThresholdValueChanged}
            metricUnitPostfix={metricUnitPostfix}
          />
          <UseSuggestedValueButton form={form} onChange={onChange} metricUnitPostfix={metricUnitPostfix} />
        </ThresholdConditionFormGroup>
      )}

      {thresholdType !== 'staticThreshold' && (
        <ThresholdDeviationSliderForm
          form={form}
          onChange={onChange}
          trackChange={applicationsAlertingThresholdDeviationFactorChanged}
          defaultValue={defaultDeviationFactor}
        />
      )}
    </>
  );
}

ThroughputInteractiveChart.propTypes = {
  isGlobalSmartAlert: PropTypes.bool,
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  editMode: PropTypes.bool
};
