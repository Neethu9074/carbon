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
import { applicationThresholdTypeOptions } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import ThresholdLabel from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdLabel';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/applications/advanced/ThresholdTypeSelection';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';

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

            <ThresholdTypeSelection
              form={form}
              updateForm={updateForm}
              editMode={editMode}
              trackThresholdTypeChanged={applicationsAlertingThresholdTypeChanged}
              thresholdTypeOptions={applicationThresholdTypeOptions}
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
          isGlobalSmartAlert={isGlobalSmartAlert}
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

StatusCodeThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  isGlobalSmartAlert: PropTypes.bool
};
