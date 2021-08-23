/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdAggregationChanged,
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdTypeChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import {
  getAggregationLabel,
  getConfiguredThreshold,
  getOperatorLabel
} from 'in-alerting/smart-alerts/applications/advanced/thresholdConditionUtil';
import ThresholdValueFormGroupForStaticThreshold from 'in-alerting/smart-alerts/applications/advanced/ThresholdValueFormGroupForStaticThreshold';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdDeviationSliderForm';
import FixedThresholdConditionForBuiltInAlert from 'in-alerting/smart-alerts/applications/advanced/FixedThresholdConditionForBuiltInAlert';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import { applicationThresholdTypeOptions } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/form/ruleForm';
import ThresholdLabel from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdLabel';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/applications/advanced/ThresholdTypeSelection';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

export default function SlownessThresholdCondition({
  form,
  updateForm,
  onChange,
  blueprintConfig,
  editMode,
  isGlobalSmartAlert
}) {
  const isBuiltIn = form.get('builtIn').value;
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

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
              asSimpleDropdown
              label={getAggregationLabel(form)}
              items={getAggregationOptions(form)}
              onChange={({ value = '' }) => {
                updateForm(form.updateIn(['rule', 'aggregation'], f => f.setValue(value).setTouched(true)));

                applicationsAlertingThresholdAggregationChanged(getTrackingObject(form, { value }));
              }}
            />
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
          label={t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold')}
          isGlobalSmartAlert={isGlobalSmartAlert}
        />
      )}

      {thresholdType !== STATIC_THRESHOLD && (
        <ThresholdDeviationSliderForm
          form={form}
          onChange={onChange}
          trackChange={applicationsAlertingThresholdTypeChanged}
          defaultValue={defaultDeviationFactor}
        />
      )}
    </>
  );
}

SlownessThresholdCondition.propTypes = {
  isGlobalSmartAlert: PropTypes.bool,
  blueprintConfig: blueprintConfigPropType.isRequired,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
