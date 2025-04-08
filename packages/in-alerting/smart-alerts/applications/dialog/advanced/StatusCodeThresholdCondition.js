/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import FixedThresholdConditionForBuiltInAlert from 'in-alerting/smart-alerts/applications/dialog/advanced/FixedThresholdConditionForBuiltInAlert';
import ThresholdValueFormGroupForMultiStaticThreshold from 'in-alerting/smart-alerts/components/ThresholdValueFormGroupForMultiStaticThreshold';
import {
  getConfiguredThreshold,
  getOperatorLabel
} from 'in-alerting/smart-alerts/applications/dialog/advanced/thresholdConditionUtil';
import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/dialog/advanced/MultiThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/applications/dialog/advanced/ThresholdTypeSelection';
import { getMetricUnitPostfix, isPercentageMetric } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/dialog.mless';

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
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
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
              className={locals.dropdownmd}
              onChange={value => {
                updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));
              }}
            />
            <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />

            <ThresholdTypeSelection
              form={form}
              updateForm={updateForm}
              editMode={editMode}
              thresholdTypeOptions={thresholdTypeOptions}
              isGlobalSmartAlert={isGlobalSmartAlert}
              blueprintType={blueprintConfig.type}
              showThresholdsHint
            />
          </>
        )}
      </ThresholdConditionFormGroup>

      {thresholdType === STATIC_THRESHOLD && (
        <ThresholdValueFormGroupForMultiStaticThreshold
          form={form}
          updateForm={updateForm}
          maxValue={maxValue}
          metricUnitPostfix={metricUnitPostfix}
          isGlobalSmartAlert={isGlobalSmartAlert}
          percentageMetric={percentageMetric}
        />
      )}

      {thresholdType !== STATIC_THRESHOLD && (
        <MultiThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
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
