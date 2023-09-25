/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Stack, Spacer } from '@instana/components';

import { onThresholdTypeChange as mobileAppOnThresholdTypeChange } from 'in-alerting/smart-alerts/mobileApp/form/thresholdTypeForm';
import { onThresholdTypeChange as websiteOnThresholdTypeChange } from 'in-alerting/smart-alerts/websites/form/thresholdTypeForm';
import { getOptionsFilterForThresholdTyp } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ThresholdTypesHelp } from 'in-alerting/smart-alerts/components/dialog/ThresholdTypesHelp';
import { ThresholdTypeOptions } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import Dropdown from 'in-alerting/components/Dropdown';

interface ThresholdTypeSelectionProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  editMode?: boolean;
  thresholdTypeOptions: ThresholdTypeOptions;
  eumType: string;
}
export default function ThresholdTypeSelection({
  form,
  updateForm,
  editMode,
  thresholdTypeOptions,
  eumType
}: ThresholdTypeSelectionProps) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const options = thresholdTypeOptions.filter(getOptionsFilterForThresholdTyp(thresholdType));
  const thresholdComboBoxValue = getThresholdComboBoxValue(form);

  return (
    <>
      {options.length === 1 ? (
        <span>{options[0].label}</span>
      ) : (
        <Dropdown
          value={thresholdComboBoxValue as string}
          items={options}
          onChange={newThresholdTypeWithSeasonality => {
            if (eumType === websiteEum) {
              return websiteOnThresholdTypeChange(newThresholdTypeWithSeasonality, form, updateForm);
            }
            if (eumType === mobileAppEum) {
              return mobileAppOnThresholdTypeChange(newThresholdTypeWithSeasonality, form, updateForm);
            }
            return '';
          }}
        />
      )}

      <>
        <Spacer vertical="xxsmall" />
        <Stack space="xxsmall" align="center" direction="horizontal">
          {options.length > 1 && thresholdType !== ADAPTIVE_BASELINE && <ThresholdTypesHelp />}
          {thresholdType === HISTORIC_BASELINE && (
            <RecalculateBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
          )}
        </Stack>
      </>
    </>
  );
}
