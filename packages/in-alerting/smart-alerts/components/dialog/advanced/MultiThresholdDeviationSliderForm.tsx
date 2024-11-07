/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React, { useEffect } from 'react';

import { Checkbox, Stack } from '@instana/components';

//@ts-expect-error TS migration
import { DebouncedSensitivitySlider } from 'in-alerting/smart-alerts/components/dialog/advanced/SensitivitySlider';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/MultiThresholdDeviationSliderForm.mless';

interface MultiThresholdDeviationSliderFormProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  defaultValue: number;
  isTearSheet?: boolean;
}

export function MultiThresholdDeviationSliderForm({
  form,
  updateForm,
  defaultValue,
  isTearSheet
}: MultiThresholdDeviationSliderFormProps) {
  const warningThresholdField = form.get('threshold').get('warningThreshold') as MapForm<any>;
  const criticalThresholdField = form.get('threshold').get('criticalThreshold') as MapForm<any>;
  const isWarningChecked = warningThresholdField.get('isCheckboxSelected').value;
  const isCriticalChecked = criticalThresholdField.get('isCheckboxSelected').value;

  useEffect(() => {
    if (isWarningChecked && warningThresholdField.get('deviationFactor')?.value === 0) {
      updateForm(updateDeviationFactor('warningThreshold'));
    }

    if (isCriticalChecked && criticalThresholdField.get('deviationFactor')?.value === 0) {
      updateForm(updateDeviationFactor('criticalThreshold'));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWarningChecked, isCriticalChecked]);

  return (
    <ThresholdConditionFormGroup
      iconType="lib_threshold"
      label={t('in-alerting:smartAlerts.components.smartAlertDialog.labelSensitivity')}
      isTearSheet={isTearSheet}
      isMultiThreshold
    >
      <div className={locals.multiThresholdContainer}>
        <Stack gap="small">
          <Checkbox
            label={t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel')}
            size="large"
            wrapperClassName={locals.elementPadding}
            checked={isWarningChecked}
            onChange={() => {
              updateForm(
                form.updateIn(['threshold', 'warningThreshold'], thresholdMapForm =>
                  (thresholdMapForm as MapForm<any>).updateIn(['isCheckboxSelected'], item =>
                    (item as Field<any>).setValue(!isWarningChecked).setTouched(true)
                  )
                )
              );
            }}
          />
          <DebouncedSensitivitySlider
            value={getFormValueOrDefault(
              form.get('threshold').get('warningThreshold'),
              'deviationFactor',
              defaultValue
            )}
            defaultValue={defaultValue}
            onChange={(value: number) => {
              updateForm(
                form.updateIn(['threshold', 'warningThreshold'], thresholdMapForm =>
                  (thresholdMapForm as MapForm<any>).updateIn(['deviationFactor'], item =>
                    (item as Field<any>).setValue(value).setTouched(true)
                  )
                )
              );
            }}
            disabled={!isWarningChecked}
          />

          <Checkbox
            label={t('in-alerting:smartAlerts.components.smartAlertDialog.criticalThresholdLabel')}
            size="large"
            wrapperClassName={locals.elementPadding}
            checked={isCriticalChecked}
            onChange={() => {
              updateForm(
                form.updateIn(['threshold', 'criticalThreshold'], thresholdMapForm =>
                  (thresholdMapForm as MapForm<any>).updateIn(['isCheckboxSelected'], item =>
                    (item as Field<any>).setValue(!isCriticalChecked).setTouched(true)
                  )
                )
              );
            }}
          />
          <DebouncedSensitivitySlider
            value={getFormValueOrDefault(
              form.get('threshold').get('criticalThreshold'),
              'deviationFactor',
              defaultValue
            )}
            defaultValue={defaultValue}
            onChange={(value: number) => {
              updateForm(
                form.updateIn(['threshold', 'criticalThreshold'], thresholdMapForm =>
                  (thresholdMapForm as MapForm<any>).updateIn(['deviationFactor'], item =>
                    (item as Field<any>).setValue(value).setTouched(true)
                  )
                )
              );
            }}
            disabled={!isCriticalChecked}
          />
          <div className={locals.infoElementPadding}>
            <Stack>
              <TouchedMessages field={form.get('threshold')} />
              <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.multiThresholdAlertNotificationInfo')}</div>
            </Stack>
          </div>
        </Stack>
      </div>
    </ThresholdConditionFormGroup>
  );

  function updateDeviationFactor(thresholdType: string) {
    return form.updateIn(['threshold', thresholdType], thresholdMapForm =>
      (thresholdMapForm as MapForm<any>).updateIn(['deviationFactor'], item =>
        (item as Field<any>).setValue(defaultDeviationFactor).setTouched(true)
      )
    );
  }
}
