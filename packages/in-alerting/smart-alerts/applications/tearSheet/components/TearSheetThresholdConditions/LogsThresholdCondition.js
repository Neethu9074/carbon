/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import ThresholdValueFormGroupForStaticThreshold from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ThresholdValueFormGroupForStaticThreshold';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ThresholdConditionFormGroup';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ThresholdTypeSelection';
import FixedThresholdConditionForBuiltInAlert from 'in-alerting/smart-alerts/applications/dialog/advanced/FixedThresholdConditionForBuiltInAlert';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { getOperatorLabel } from 'in-alerting/smart-alerts/applications/dialog/advanced/thresholdConditionUtil';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import ThresholdLabel from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdLabel';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import { t } from 'in-i18n';

export default function LogsThresholdCondition({ form, updateForm, blueprintConfig, editMode, isGlobalSmartAlert }) {
  const metricName = form.get('rule').get('metricName').value;
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const isBuiltIn = form.get('builtIn').value;
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();

  return (
    <>
      <ThresholdConditionFormGroup>
        {isBuiltIn ? (
          <FixedThresholdConditionForBuiltInAlert
            metricLabel={blueprintConfig.getMetricLabel(metricName)}
            operatorLabel={getOperatorLabel(form)}
            configuredThreshold={t(
              'in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold'
            )}
          />
        ) : (
          <>
            <ThresholdLabel>{blueprintConfig.getMetricLabel(metricName)}</ThresholdLabel>
            <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
            <ThresholdTypeSelection
              form={form}
              updateForm={updateForm}
              editMode={editMode}
              thresholdTypeOptions={thresholdTypeOptions}
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
          isGlobalSmartAlert={isGlobalSmartAlert}
          hasSmallInputField
        />
      )}

      {thresholdType !== STATIC_THRESHOLD && (
        <ThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
      )}
    </>
  );
}

LogsThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  isGlobalSmartAlert: PropTypes.bool
};
