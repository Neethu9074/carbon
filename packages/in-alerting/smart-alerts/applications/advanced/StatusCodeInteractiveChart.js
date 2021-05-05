/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdValueChanged,
  applicationsAlertingThresholdDeviationFactorChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/smart-alert-dialog/IncompleteChartPlaceholder';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { createStatusCodeForm, defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import { findEntryByValue, alertConfigWithDefaultValues } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import { PER_AP } from './EvaluationSwitch/alertEvaluationTypes';
import Dropdown from 'in-alerting/components/Dropdown';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/InteractiveChart.mless';

export default function StatusCodeInteractiveChart({
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

  if (!blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule)) {
    return (
      <div className={locals.container}>
        <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
      </div>
    );
  }

  return (
    <div className={locals.container}>
      <ThresholdCondition
        form={form}
        onChange={onChange}
        updateForm={updateForm}
        blueprintConfig={blueprintConfig}
        isGlobalSmartAlert={isGlobalSmartAlert}
        editMode={editMode}
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

export function ThresholdCondition({ form, onChange, updateForm, blueprintConfig, editMode, isGlobalSmartAlert }) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdType = form.get('threshold').get('type')?.value;
  const canSelectBaseline = form.get('evaluationType').value === PER_AP && !isGlobalSmartAlert;

  return (
    <>
      <ThresholdConditionFormGroup>
        <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
        <ThresholdOperatorDropDown
          form={form}
          onChange={onChange}
          trackingCallback={applicationsAlertingThresholdOperatorChanged}
        />
        {canSelectBaseline ? (
          <>
            <Dropdown
              asSimpleDropdown
              label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
              items={thresholdTypeOptions}
              onChange={e => onThresholdChange(e, form, updateForm)}
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
          defaultValue={defaultDeviationFactor}
          trackChange={applicationsAlertingThresholdDeviationFactorChanged}
        />
      )}
    </>
  );
}

function onThresholdChange(e, form, updateForm) {
  const selection = e?.value ?? '';
  const [newType, newSeasonality] = selection.split('.');

  let newThresholdForm = createStatusCodeForm({
    ...form.get('threshold').toJS(),
    type: newType
  });

  if (newSeasonality) {
    newThresholdForm = newThresholdForm.updateIn(['seasonality'], f => f.setValue(newSeasonality).setTouched());
  }

  const newRuleForm = createRuleForm({ ...form.get('rule').toJS(), aggregation: null });

  updateForm(form.put('threshold', newThresholdForm).put('rule', newRuleForm));
}

StatusCodeInteractiveChart.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  isGlobalSmartAlert: PropTypes.bool
};
