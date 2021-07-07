/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingThresholdDeviationFactorChanged,
  websitesAlertingThresholdMetricChanged,
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdTypeChanged,
  websitesAlertingThresholdValueChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import createThresholdForm, { defaultDeviationFactor } from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

export default function ThroughputThresholdCondition({ form, updateForm, onChange, blueprintConfig, editMode }) {
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
            updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));
            websitesAlertingThresholdMetricChanged(getTrackingObject(form, { value }));
          }}
        />
        <ThresholdOperatorDropDown
          form={form}
          customOnChange={newOperator => {
            updateForm(form.updateIn(['threshold', 'operator'], f => f.setValue(newOperator).setTouched(true)));
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
            const newThresholdTypeWithSeasonality = e?.value ?? '';
            const valueParts = newThresholdTypeWithSeasonality.split('.');
            const newThresholdType = valueParts[0];

            let newThresholdForm = createThresholdForm(
              {
                ...form.get('threshold').toJS(),
                type: newThresholdType
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

            updateForm(form.put('threshold', newThresholdForm).put('rule', newRuleForm));

            websitesAlertingThresholdTypeChanged(getTrackingObject(form, { value: newThresholdType }));
          }}
          defaultValue={STATIC_THRESHOLD}
        />
        {thresholdType === HISTORIC_BASELINE && (
          <RecalculateBaselineButton onChange={onChange} editMode={editMode} form={form} />
        )}
      </ThresholdConditionFormGroup>
      {thresholdType === STATIC_THRESHOLD && (
        <ThresholdConditionFormGroup
          iconType="lib_threshold"
          label={t('in-alerting:smartAlerts.websites.advanced.thresholdValue')}
        >
          <ThresholdValueInput
            max={maxValue}
            form={form}
            updateForm={updateForm}
            trackChange={websitesAlertingThresholdValueChanged}
            metricUnitPostfix={metricUnitPostfix}
          />
          <UseSuggestedValueButton form={form} onChange={onChange} metricUnitPostfix={metricUnitPostfix} />
        </ThresholdConditionFormGroup>
      )}

      {thresholdType !== STATIC_THRESHOLD && (
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

ThroughputThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
