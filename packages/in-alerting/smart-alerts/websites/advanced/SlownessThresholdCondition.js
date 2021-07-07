/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingAggregationChanged,
  websitesAlertingThresholdDeviationFactorChanged,
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
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/form/ruleForm';
import { getAggregationLabel } from 'in-alerting/smart-alerts/applications/advanced/thresholdConditionUtil';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

export default function SlownessThresholdCondition({ form, updateForm, onChange, blueprintConfig, editMode }) {
  const metricName = form.get('rule').get('metricName').value;
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);

  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <>
      <ThresholdConditionFormGroup>
        <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
        <Dropdown
          asSimpleDropdown
          label={getAggregationLabel(form)}
          items={getAggregationOptions(form)}
          onChange={({ value = '' }) => {
            updateForm(form.updateIn(['rule', 'aggregation'], f => f.setValue(value).setTouched(true)));
            websitesAlertingAggregationChanged(getTrackingObject(form, { value }));
          }}
        />
        <ThresholdOperatorDropDown
          form={form}
          onChange={onChange}
          trackingCallback={websitesAlertingThresholdOperatorChanged}
        />
        <Dropdown
          asSimpleDropdown
          label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
          items={thresholdTypeOptions}
          onChange={e => {
            const value = e?.value ?? '';
            const valueParts = value.split('.');
            const thresholdType = valueParts[0];

            let newThresholdForm = createThresholdForm(
              {
                ...form.get('threshold').toJS(),
                type: thresholdType
              },
              form.get('rule').get('alertType').value
            );

            if (valueParts.length > 1) {
              const seasonality = valueParts[1];
              newThresholdForm = newThresholdForm.updateIn(['seasonality'], f => f.setValue(seasonality).setTouched());
            }

            const newRuleForm = createRuleForm({ ...form.get('rule').toJS() });

            updateForm(form.put('threshold', newThresholdForm).put('rule', newRuleForm));

            websitesAlertingThresholdTypeChanged(getTrackingObject(form, { value: thresholdType }));
          }}
        />
        {thresholdType === HISTORIC_BASELINE && (
          <RecalculateBaselineButton onChange={onChange} editMode={editMode} form={form} />
        )}
      </ThresholdConditionFormGroup>

      {thresholdType === STATIC_THRESHOLD && (
        <ThresholdConditionFormGroup
          iconType="lib_threshold"
          label={t('in-alerting:smartAlerts.websites.advanced.slownessInteractiveChartThresholdValue')}
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

SlownessThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
