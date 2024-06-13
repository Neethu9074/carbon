/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Spacer } from '@instana/components';

import ThresholdValueFormGroupForStaticThreshold from 'in-alerting/smart-alerts/dialog/advanced/ThresholdValueFormGroupForStaticThreshold';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdDeviationSliderForm';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/ThresholdTypeSelection';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { getMetricUnitPostfix, isPercentageMetric } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep4.mless';

export default function ErrorRateThresholdCondition({
  form,
  updateForm,
  blueprintConfig,
  editMode,
  isGlobalSmartAlert
}) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  const percentageMetric = isPercentageMetric(metricName);

  return (
    <>
      <ThresholdTypeSelection
        form={form}
        updateForm={updateForm}
        editMode={editMode}
        thresholdTypeOptions={thresholdTypeOptions}
        isGlobalSmartAlert={isGlobalSmartAlert}
        blueprintConfig={blueprintConfig}
      />

      <div className={locals.container}>
        <span className={locals.label}>
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdValue')}
          />
        </span>
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions isTearSheet />
        {thresholdType === STATIC_THRESHOLD && (
          <ThresholdValueFormGroupForStaticThreshold
            form={form}
            updateForm={updateForm}
            maxValue={maxValue}
            metricUnitPostfix={metricUnitPostfix}
            isGlobalSmartAlert={isGlobalSmartAlert}
            hasSmallInputField
            percentageMetric={percentageMetric}
            isTearSheet
            showLabel={false}
          />
        )}
      </div>

      {thresholdType !== STATIC_THRESHOLD && (
        <>
          <Spacer vertical="normal" />
          <Spacer vertical="xsmall" />
          <ThresholdDeviationSliderForm
            form={form}
            updateForm={updateForm}
            defaultValue={defaultDeviationFactor}
            isTearSheet
          />
        </>
      )}
    </>
  );
}

ErrorRateThresholdCondition.propTypes = {
  form: PropTypes.object.isRequired,
  blueprintConfig: blueprintConfigPropType,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  isGlobalSmartAlert: PropTypes.bool
};
