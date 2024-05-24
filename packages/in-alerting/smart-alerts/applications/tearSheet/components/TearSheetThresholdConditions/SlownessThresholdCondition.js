/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  getAggregationLabel,
  getAggregationValue,
  getConfiguredThreshold,
  getOperatorLabel
} from 'in-alerting/smart-alerts/applications/dialog/advanced/thresholdConditionUtil';
import ThresholdValueFormGroupForStaticThreshold from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ThresholdValueFormGroupForStaticThreshold';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ThresholdConditionFormGroup';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/applications/tearSheet/components/TearSheetThresholdConditions/ThresholdTypeSelection';
import FixedThresholdConditionForBuiltInAlert from 'in-alerting/smart-alerts/applications/dialog/advanced/FixedThresholdConditionForBuiltInAlert';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/dialog/form/ruleForm';
import ThresholdLabel from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdLabel';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

export default function SlownessThresholdCondition({
  form,
  updateForm,
  blueprintConfig,
  editMode,
  isGlobalSmartAlert
}) {
  const isBuiltIn = form.get('builtIn').value;
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();

  return (
    <>
      <ThresholdConditionFormGroup>
        {isBuiltIn ? (
          <FixedThresholdConditionForBuiltInAlert
            metricLabel={blueprintConfig.getMetricLabel(metricName)}
            aggregationLabel={getAggregationLabel(form)}
            operatorLabel={getOperatorLabel(form)}
            configuredThreshold={getConfiguredThreshold(form, isGlobalSmartAlert)}
          />
        ) : (
          <>
            <ThresholdLabel>{blueprintConfig.getMetricLabel(metricName)}</ThresholdLabel>
            <Dropdown
              value={getAggregationValue(form)}
              items={getAggregationOptions(form)}
              onChange={value => {
                updateForm(form.updateIn(['rule', 'aggregation'], f => f.setValue(value).setTouched(true)));
              }}
            />
            <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
            <ThresholdTypeSelection
              form={form}
              updateForm={updateForm}
              editMode={editMode}
              thresholdTypeOptions={thresholdTypeOptions}
              isGlobalSmartAlert={isGlobalSmartAlert}
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
          label={t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold')}
          isGlobalSmartAlert={isGlobalSmartAlert}
        />
      )}

      {thresholdType !== STATIC_THRESHOLD && (
        <ThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
      )}
    </>
  );
}

SlownessThresholdCondition.propTypes = {
  isGlobalSmartAlert: PropTypes.bool,
  blueprintConfig: blueprintConfigPropType.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
