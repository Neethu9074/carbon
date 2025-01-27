/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Spacer } from '@instana/components';

import { getOptionsFilterForThresholdTyp } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import { ThresholdTypeOptions } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import mobileAppCreateRuleForm from 'in-alerting/smart-alerts/mobileApp/form/ruleForm';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import websiteCreateRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import Dropdown from 'in-alerting/components/Dropdown';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/dialog.mless';

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
  const websiteOnThresholdTypeChange = useOnThresholdTypeChange(websiteCreateRuleForm);
  const mobileAppOnThresholdTypeChange = useOnThresholdTypeChange(mobileAppCreateRuleForm);

  return (
    <>
      {options.length > 1 && (
        <Dropdown
          value={thresholdComboBoxValue as string}
          className={locals.dropdownxlg}
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

      <Spacer vertical="xxsmall" />

      {thresholdType === HISTORIC_BASELINE && (
        <RecalculateBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
      )}
    </>
  );
}
