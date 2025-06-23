/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// eslint-disable-next-line no-restricted-imports
import { ExpandableTile, TileAboveTheFoldContent, TileBelowTheFoldContent } from '@carbon/react';
import { Field, Item, MapForm } from 'formalistic';
import React, { useEffect } from 'react';
import classNames from 'classnames';

import { Checkbox, Stack } from '@instana/components';

import {
  updateAlertChannelSelectionOnWarningThresholdFieldChange,
  updateAlertChannelSelectionOnCriticalThresholdFieldChange
} from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
//@ts-expect-error TS migration
import { DebouncedSensitivitySlider } from 'in-alerting/smart-alerts/components/dialog/advanced/SensitivitySlider';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
//@ts-expect-error TS migration
import DebouncedDistinctSlider from 'in-components/Slider/DebouncedDistinctSlider';
import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { overrideAdaptiveBaselineSmoothingParamsEnabled } from 'in-services/featureFlags';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/MultiThresholdDeviationSliderForm.mless';

const getCommonAdaptiveBaselineFields = (form: MapForm<any>) => {
  const warningThreshold = form.get('threshold').get('warningThreshold') as MapForm<any>;
  const criticalThreshold = form.get('threshold').get('criticalThreshold') as MapForm<any>;
  const type = warningThreshold.get('type')?.value ?? criticalThreshold.get('type')?.value;
  const adaptability = warningThreshold.get('adaptability')?.value ?? criticalThreshold.get('adaptability')?.value;
  const seasonality = warningThreshold.get('seasonality')?.value ?? criticalThreshold.get('seasonality')?.value;
  return { type, adaptability, seasonality };
};

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
  const warningThresholdCheckBoxField = warningThresholdField.get('isCheckboxSelected');
  const criticalThresholdCheckBoxField = criticalThresholdField.get('isCheckboxSelected');
  const isWarningChecked = warningThresholdCheckBoxField?.value;
  const isCriticalChecked = criticalThresholdCheckBoxField?.value;
  const alertChannelSelection = form.get('alertChannels').value;
  const { type: thresholdType, seasonality, adaptability } = getCommonAdaptiveBaselineFields(form);

  // Workaround until we can reference the seasonality options from the backend
  const seasonalityOptions = [
    { value: 'AUTO', label: 'Auto' },
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' }
  ];

  useEffect(() => {
    updateAlertChannelSelectionOnWarningThresholdFieldChange(
      alertChannelSelection,
      isWarningChecked,
      isCriticalChecked,
      form,
      updateForm
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warningThresholdCheckBoxField]);

  useEffect(() => {
    updateAlertChannelSelectionOnCriticalThresholdFieldChange(
      alertChannelSelection,
      isWarningChecked,
      isCriticalChecked,
      form,
      updateForm
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criticalThresholdCheckBoxField]);

  const handleCheckboxChange = (thresholdType: 'warningThreshold' | 'criticalThreshold', target: boolean) => {
    const field = form.get('threshold').get(thresholdType) as MapForm<any>;

    // Toggle the checkbox state
    const updatedForm = form.updateIn(['threshold', thresholdType], thresholdMapForm =>
      (thresholdMapForm as MapForm<any>).updateIn(['isCheckboxSelected'], item =>
        (item as Field<boolean>).setValue(target).setTouched(true)
      )
    );

    updateForm(updatedForm);

    // Set the default deviation factor if unchecked and deviationFactor is 0
    if (target && field.get('deviationFactor')?.value === 0) {
      updateForm(
        (updatedForm as MapForm<any>).updateIn(['threshold', thresholdType], thresholdMapForm =>
          (thresholdMapForm as MapForm<any>).updateIn(['deviationFactor'], item =>
            (item as Field<number>).setValue(defaultValue).setTouched(true)
          )
        )
      );
    }
  };

  const handleSliderChange = (thresholdType: 'warningThreshold' | 'criticalThreshold', value: number) => {
    updateForm(
      form.updateIn(['threshold', thresholdType], thresholdMapForm =>
        (thresholdMapForm as MapForm<any>).updateIn(['deviationFactor'], item =>
          (item as Field<number>).setValue(value).setTouched(true)
        )
      )
    );
  };

  const handleAdaptiveBaselineAdvancedSettingChange = (parameter: string, value: any) => {
    let updatedForm = form;
    const updateThreshold = (thresholdMapForm: Item) => {
      const updated = (thresholdMapForm as MapForm<any>).updateIn([parameter], item =>
        (item as Field<any>).setValue(value).setTouched(true)
      );
      return updated;
    };
    updatedForm = updatedForm.updateIn(['threshold', 'warningThreshold'], updateThreshold);
    updatedForm = updatedForm.updateIn(['threshold', 'criticalThreshold'], updateThreshold);
    updateForm(updatedForm);
  };

  return (
    <ThresholdConditionFormGroup
      iconType="lib_threshold"
      label={t('in-alerting:smartAlerts.components.smartAlertDialog.labelSensitivity')}
      isTearSheet={isTearSheet}
      isMultiThreshold
    >
      <div className={classNames({ [locals.multiThresholdContainer]: true, [locals.topSpace]: !isTearSheet })}>
        <Stack gap="small">
          <Checkbox
            label={t('in-alerting:smartAlerts.components.smartAlertDialog.warningThresholdLabel')}
            size="large"
            wrapperClassName={locals.elementPadding}
            checked={isWarningChecked}
            onChange={({ target }) => handleCheckboxChange('warningThreshold', target.checked)}
          />
          <DebouncedSensitivitySlider
            value={getFormValueOrDefault(
              form.get('threshold').get('warningThreshold'),
              'deviationFactor',
              defaultValue
            )}
            defaultValue={defaultValue}
            onChange={(value: number) => handleSliderChange('warningThreshold', value)}
            disabled={!isWarningChecked}
          />

          <Checkbox
            label={t('in-alerting:smartAlerts.components.smartAlertDialog.criticalThresholdLabel')}
            size="large"
            wrapperClassName={locals.elementPadding}
            checked={isCriticalChecked}
            onChange={({ target }) => handleCheckboxChange('criticalThreshold', target.checked)}
          />
          <DebouncedSensitivitySlider
            value={getFormValueOrDefault(
              form.get('threshold').get('criticalThreshold'),
              'deviationFactor',
              defaultValue
            )}
            defaultValue={defaultValue}
            onChange={(value: number) => handleSliderChange('criticalThreshold', value)}
            disabled={!isCriticalChecked}
          />

          <div className={locals.infoElementPadding}>
            <Stack>
              <TouchedMessages field={form.get('threshold')} />
              <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.multiThresholdAlertNotificationInfo')}</div>
            </Stack>
          </div>
          {thresholdType === ADAPTIVE_BASELINE && overrideAdaptiveBaselineSmoothingParamsEnabled && (
            <ExpandableTile>
              <TileAboveTheFoldContent>
                <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.advancedSettingsTrayTitle')}</div>
              </TileAboveTheFoldContent>
              <TileBelowTheFoldContent>
                <Stack gap="small">
                  <label>{t('in-alerting:smartAlerts.components.smartAlertDialog.seasonality')}</label>
                  <Dropdown
                    value={seasonality ?? 'AUTO'}
                    className={locals.dropdownxlg}
                    items={seasonalityOptions}
                    onChange={newSeasonality => {
                      handleAdaptiveBaselineAdvancedSettingChange(
                        'seasonality',
                        newSeasonality === 'AUTO' ? null : newSeasonality
                      );
                    }}
                  />
                  <label>{t('in-alerting:smartAlerts.components.smartAlertDialog.adaptability')}</label>
                  <DebouncedDistinctSlider
                    min={0.01}
                    max={1}
                    step={0.01}
                    value={adaptability ?? 1}
                    onChange={(value: number) => handleAdaptiveBaselineAdvancedSettingChange('adaptability', value)}
                    marks={[
                      { value: 0.01, label: '0.01' },
                      { value: 0.5, label: '0.5' },
                      { value: 1, label: '1' }
                    ]}
                  />
                </Stack>
              </TileBelowTheFoldContent>
            </ExpandableTile>
          )}
        </Stack>
      </div>
    </ThresholdConditionFormGroup>
  );
}
