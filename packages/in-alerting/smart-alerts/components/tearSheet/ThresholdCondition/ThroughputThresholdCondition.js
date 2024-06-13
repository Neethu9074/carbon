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
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep4.mless';

export default function ThroughputThresholdCondition({
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

  return (
    <>
      <ThresholdTypeSelection
        form={form}
        updateForm={updateForm}
        editMode={editMode}
        thresholdTypeOptions={thresholdTypeOptions}
        isGlobalSmartAlert={isGlobalSmartAlert}
        blueprintType={blueprintConfig.type}
        blueprintConfig={blueprintConfig}
      />

      <div className={locals.container} id="thresholdValue">
        <span className={locals.label}>
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdValue')}
          />
        </span>
        <ThresholdOperatorDropDown
          form={form}
          customOnChange={newOperator => {
            updateForm(form.updateIn(['threshold', 'operator'], f => f.setValue(newOperator).setTouched(true)));
          }}
          allOptions
          isTearSheet
        />
        {thresholdType === STATIC_THRESHOLD && (
          <ThresholdValueFormGroupForStaticThreshold
            form={form}
            updateForm={updateForm}
            maxValue={maxValue}
            metricUnitPostfix={metricUnitPostfix}
            isGlobalSmartAlert={isGlobalSmartAlert}
            isTearSheet
            showLabel={false}
          />
        )}
      </div>

      {thresholdType !== STATIC_THRESHOLD && (
        <>
          <Spacer vertical="xsmall" />
          <Spacer vertical="normal" />
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

ThroughputThresholdCondition.propTypes = {
  isGlobalSmartAlert: PropTypes.bool,
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
