/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React, { useEffect } from 'react';

import { Checkbox, Stack, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';

import {
  updateAlertChannelSelectionOnWarningThresholdFieldChange,
  updateAlertChannelSelectionOnCriticalThresholdFieldChange
} from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import ThresholdValueInputWithValidationMessage from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueWithValidationMessage';
import {
  getMaxMetricValue,
  getThresholdTypeOptions
} from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import {
  WARNING_THRESHOLD,
  CRITICAL_THRESHOLD
} from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { setValidNextValue } from 'in-alerting/smart-alerts/utils/thresholdUtils';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/components/LogMultiThresholdCondition.mless';

interface LogMultiThresholdConditionProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  percentageMetric: boolean;
  metricUnitPostfix: string;
}

export default function LogMultiThresholdCondition({
  form,
  updateForm,
  percentageMetric,
  metricUnitPostfix
}: LogMultiThresholdConditionProps) {
  const maxValue = getMaxMetricValue(percentageMetric);
  const thresholdType = getThresholdTypeOptions();
  const warningThresholdField = form.get('threshold').get('warningThreshold').get('value');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold').get('value');
  const warningThresholdValue = warningThresholdField.value;
  const criticalThresholdValue = criticalThresholdField.value;
  const warningThresholdValuePresent = !isEmpty(warningThresholdValue);
  const criticalThresholdValuePresent = !isEmpty(criticalThresholdValue);
  const alertChannelSelection = form.get('alertChannels').value;
  const operator = form.get('threshold').get('operator').value;

  useEffect(() => {
    updateAlertChannelSelectionOnWarningThresholdFieldChange(
      alertChannelSelection,
      warningThresholdValuePresent,
      criticalThresholdValuePresent,
      form,
      updateForm
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warningThresholdField]);

  useEffect(() => {
    updateAlertChannelSelectionOnCriticalThresholdFieldChange(
      alertChannelSelection,
      warningThresholdValuePresent,
      criticalThresholdValuePresent,
      form,
      updateForm
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criticalThresholdField]);

  return (
    <div className={locals.gridWrapper}>
      <SvgIcon className={locals.icon} type="lib_alerting_threshold_icon" />
      <span className={locals.label}>{t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold')}</span>
      <div className={locals.infraThresholdOperatorWrapper}>
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
        <span>{thresholdType[0].label}</span>
      </div>
      <span />
      <Checkbox
        label={t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel')}
        size="large"
        checked={warningThresholdValuePresent}
        onChange={({ target }) => {
          setValidNextValue({
            isChecked: target.checked,
            thresholdValue: criticalThresholdValue,
            thresholdType: WARNING_THRESHOLD,
            updateForm,
            updatedThresholdValue,
            percentageMetric,
            operator
          });
        }}
      />
      <Stack direction="horizontal" align="center">
        <ThresholdValueInputWithValidationMessage
          max={maxValue}
          form={form}
          updateForm={updateForm}
          percentageMetric={percentageMetric}
          metricUnitPostfix={metricUnitPostfix}
          thresholdField={warningThresholdField}
          getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'warningThreshold')}
          isMultiThreshold
          id="warningThreshold"
        />
        <Tooltip
          align="bottomMiddle"
          content={t('in-alerting:smartAlerts.logs.advancedModeContainer.threshold.tooltipText')}
        >
          <SvgIcon type="lib_help_error_info_outline" size="s" color={themes.default.ids.color.option.neutral['700']} />
        </Tooltip>
      </Stack>
      <span />
      <Checkbox
        label={t('in-alerting:smartAlerts.components.smartAlertDialog.criticalThresholdLabel')}
        size="large"
        checked={criticalThresholdValuePresent}
        onChange={({ target }) => {
          setValidNextValue({
            isChecked: target.checked,
            thresholdValue: warningThresholdValue,
            thresholdType: CRITICAL_THRESHOLD,
            updateForm,
            updatedThresholdValue,
            percentageMetric,
            operator
          });
        }}
      />
      <ThresholdValueInputWithValidationMessage
        max={maxValue}
        form={form}
        updateForm={updateForm}
        percentageMetric={percentageMetric}
        metricUnitPostfix={metricUnitPostfix}
        thresholdField={criticalThresholdField}
        getUpdatedForm={targetValue => updatedThresholdValue(targetValue, 'criticalThreshold')}
        isMultiThreshold
        id="criticalThreshold"
      />
      <span />
      <span />
      <Stack gap="small">
        <TouchedMessages field={form.get('threshold')} />

        <span>{t('in-alerting:smartAlerts.components.smartAlertDialog.multiThresholdAlertNotificationInfo')}</span>
      </Stack>
    </div>
  );

  function updatedThresholdValue(targetValue: number | null, thresholdType: string) {
    return form.updateIn(['threshold', thresholdType], thresholdMapForm =>
      (thresholdMapForm as MapForm<any>).updateIn(['value'], item =>
        (item as Field<any>).setValue(targetValue).setTouched(true)
      )
    );
  }
}
