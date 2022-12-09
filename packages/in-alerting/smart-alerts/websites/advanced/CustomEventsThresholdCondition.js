/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingThresholdDeviationFactorChanged,
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdValueChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueWithValidationMessage';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/websites/advanced/ThresholdTypeSelection';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { isPercentageMetric } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

export default function CustomEventsThresholdCondition({ form, blueprintConfig, updateForm, editMode }) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdType = form.get('threshold').get('type')?.value;
  const blueprintType = blueprintConfig.type;
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  return (
    <>
      <ThresholdConditionFormGroup>
        <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
        <ThresholdOperatorDropDown
          form={form}
          updateForm={updateForm}
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
          <ThresholdValueInputWithValidationMessage
            max={maxValue}
            form={form}
            updateForm={updateForm}
            percentageMetric={percentageMetric}
            trackChange={websitesAlertingThresholdValueChanged}
            metricUnitPostfix={metricUnitPostfix}
          />
          <UseSuggestedValueButton
            form={form}
            updateForm={updateForm}
            metricUnitPostfix={metricUnitPostfix}
            percentageMetric={percentageMetric}
          />
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

CustomEventsThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
