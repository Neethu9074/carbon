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
  websitesAlertingThresholdValueChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/websites/advanced/ThresholdTypeSelection';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/ThresholdCondition.mless';

export default function ThroughputThresholdCondition({ form, updateForm, blueprintConfig, editMode }) {
  const metricName = form.get('rule').get('metricName').value;
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const blueprintType = blueprintConfig.type;

  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdField = form.get('threshold').get('value');

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

        <ThresholdTypeSelection
          form={form}
          updateForm={updateForm}
          thresholdTypeOptions={thresholdTypeOptions}
          thresholdType={thresholdType}
          blueprintType={blueprintType}
          editMode={editMode}
        />
      </ThresholdConditionFormGroup>

      {thresholdType === STATIC_THRESHOLD && (
        <ThresholdConditionFormGroup
          iconType="lib_threshold"
          label={t('in-alerting:smartAlerts.websites.advanced.thresholdValue')}
        >
          <div className={locals.thresholdValueWithValidationMessage}>
            <ThresholdValueInput
              max={maxValue}
              form={form}
              updateForm={updateForm}
              trackChange={websitesAlertingThresholdValueChanged}
              metricUnitPostfix={metricUnitPostfix}
            />
            <TouchedMessages field={thresholdField} />
          </div>
          <UseSuggestedValueButton form={form} updateForm={updateForm} metricUnitPostfix={metricUnitPostfix} />
        </ThresholdConditionFormGroup>
      )}

      {thresholdType !== STATIC_THRESHOLD && (
        <ThresholdDeviationSliderForm
          form={form}
          updateForm={updateForm}
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
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
