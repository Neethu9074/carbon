/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdDeviationFactorChanged,
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdTypeChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import ThresholdValueFormGroupForStaticThreshold from 'in-alerting/smart-alerts/applications/advanced/ThresholdValueFormGroupForStaticThreshold';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdDeviationSliderForm';
import FixedThresholdConditionForBuiltInAlert from 'in-alerting/smart-alerts/applications/advanced/FixedThresholdConditionForBuiltInAlert';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import {
  getConfiguredThreshold,
  getOperatorLabel
} from 'in-alerting/smart-alerts/applications/advanced/thresholdConditionUtil';
import { getMetricUnitPostfix, isPercentageMetric } from 'in-alerting/smart-alerts/applications/form/formUtils';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/applications/advanced/ThresholdTypeSelection';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { applicationsAlertingThresholdMetricChanged } from 'in-alerting/smart-alerts/applications/tracker';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';

export default function StatusCodeThresholdCondition({
  form,
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
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  const percentageMetric = isPercentageMetric(metricName);

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
            <Dropdown
              value={metricName}
              items={ruleMetricNameOptions.statusCode}
              onChange={value => {
                updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));

                applicationsAlertingThresholdMetricChanged(getTrackingObject(form, { value }));
              }}
            />
            <ThresholdOperatorDropDown
              form={form}
              updateForm={updateForm}
              trackingCallback={applicationsAlertingThresholdOperatorChanged}
            />

            <ThresholdTypeSelection
              form={form}
              updateForm={updateForm}
              editMode={editMode}
              trackThresholdTypeChanged={applicationsAlertingThresholdTypeChanged}
              thresholdType={thresholdType}
              thresholdTypeOptions={thresholdTypeOptions}
              isGlobalSmartAlert={isGlobalSmartAlert}
              blueprintType={blueprintConfig.type}
              showThresholdsHint
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
          isGlobalSmartAlert={isGlobalSmartAlert}
          percentageMetric={percentageMetric}
        />
      )}

      {thresholdType !== STATIC_THRESHOLD && (
        <ThresholdDeviationSliderForm
          form={form}
          updateForm={updateForm}
          defaultValue={defaultDeviationFactor}
          trackChange={applicationsAlertingThresholdDeviationFactorChanged}
        />
      )}
    </>
  );
}

StatusCodeThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  isGlobalSmartAlert: PropTypes.bool
};
