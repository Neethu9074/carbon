/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdTypeChanged,
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
import { createThroughputForm, defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import ThresholdLabel from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdLabel';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

export default function ThroughputThresholdCondition({
  form,
  updateForm,
  onChange,
  blueprintConfig,
  editMode,
  isGlobalSmartAlert
}) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
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
              customOnChange={newOperator => {
                updateForm(form.updateIn(['threshold', 'operator'], f => f.setValue(newOperator).setTouched(true)));
              }}
              trackingCallback={applicationsAlertingThresholdOperatorChanged}
              allOptions
            />
            <ThroughputBaselineConfig
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
          trackChange={applicationsAlertingThresholdDeviationFactorChanged}
          defaultValue={defaultDeviationFactor}
        />
      )}
    </>
  );
}

function ThroughputBaselineConfig({ form, updateForm, onChange, editMode, isGlobalSmartAlert }) {
  const canSelectBaseline = form.get('evaluationType').value === PER_AP && !isGlobalSmartAlert;
  const thresholdType = form.get('threshold').get('type')?.value;

  if (canSelectBaseline) {
    return (
      <>
        <Dropdown
          asSimpleDropdown
          label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
          items={thresholdTypeOptions}
          onChange={e => {
            const newThresholdTypeWithSeasonality = e?.value ?? '';
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
        {thresholdType === HISTORIC_BASELINE && (
          <RecalculateBaselineButton onChange={onChange} editMode={editMode} form={form} />
        )}
      </>
    );
  }

  return <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')}</div>;
}

ThroughputThresholdCondition.propTypes = {
  isGlobalSmartAlert: PropTypes.bool,
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
