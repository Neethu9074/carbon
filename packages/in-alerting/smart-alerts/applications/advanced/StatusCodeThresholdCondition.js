/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdDeviationFactorChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import ThresholdValueFormGroupForStaticThreshold from 'in-alerting/smart-alerts/applications/advanced/ThresholdValueFormGroupForStaticThreshold';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdDeviationSliderForm';
import FixedThresholdConditionForBuiltInAlert from 'in-alerting/smart-alerts/applications/advanced/FixedThresholdConditionForBuiltInAlert';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import {
  getOperatorLabel,
  getConfiguredThreshold
} from 'in-alerting/smart-alerts/applications/advanced/thresholdConditionUtil';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { createStatusCodeForm, defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import ThresholdLabel from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdLabel';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import { PER_AP } from './EvaluationSwitch/alertEvaluationTypes';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

export default function StatusCodeThresholdCondition({
  form,
  onChange,
  updateForm,
  blueprintConfig,
  editMode,
  isGlobalSmartAlert
}) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdType = form.get('threshold').get('type')?.value;
  const isBuiltIn = form.get('builtIn').value;

  return (
    <>
      <ThresholdConditionFormGroup>
        {isBuiltIn ? (
          <FixedThresholdConditionForBuiltInAlert
            metricLabel={blueprintConfig.getMetricLabel(metricName)}
            operatorLabel={getOperatorLabel(form)}
            configuredThreshold={getConfiguredThreshold(form, isGlobalSmartAlert)}
          />
        ) : (
          <>
            <ThresholdLabel>{blueprintConfig.getMetricLabel(metricName)}</ThresholdLabel>
            <ThresholdOperatorDropDown
              form={form}
              onChange={onChange}
              trackingCallback={applicationsAlertingThresholdOperatorChanged}
            />
            <StatusCodeBaselineConfig
              form={form}
              updateForm={updateForm}
              onChange={onChange}
              editMode={editMode}
              isGlobalSmartAlert={isGlobalSmartAlert}
            />
          </>
        )}
      </ThresholdConditionFormGroup>

      {thresholdType === STATIC_THRESHOLD && (
        <ThresholdValueFormGroupForStaticThreshold
          form={form}
          updateForm={updateForm}
          maxValue={maxValue}
          metricUnitPostfix={metricUnitPostfix}
          onChange={onChange}
        />
      )}

      {thresholdType !== STATIC_THRESHOLD && (
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

function StatusCodeBaselineConfig({ form, updateForm, onChange, editMode, isGlobalSmartAlert }) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const canSelectBaseline = form.get('evaluationType').value === PER_AP && !isGlobalSmartAlert;

  if (canSelectBaseline) {
    return (
      <>
        <Dropdown
          asSimpleDropdown
          label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
          items={thresholdTypeOptions}
          onChange={e => onThresholdChange(e, form, updateForm)}
        />
        {thresholdType === HISTORIC_BASELINE && (
          <RecalculateBaselineButton onChange={onChange} editMode={editMode} form={form} />
        )}
      </>
    );
  }

  return <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')}</div>;
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

StatusCodeThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  isGlobalSmartAlert: PropTypes.bool
};
