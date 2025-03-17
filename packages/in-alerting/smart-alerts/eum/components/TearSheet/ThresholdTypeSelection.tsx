/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Spacer, Stack } from '@instana/components';

import RecalculateMultiThresholdBaselineButton from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateMultiThresholdBaselineButton';
import { getOptionsFilterForThresholdTyp } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { getMultiThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import { ThresholdTypeOptions } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import mobileAppCreateRuleForm from 'in-alerting/smart-alerts/mobileApp/form/ruleForm';
import { getThresholdDescription } from 'in-alerting/smart-alerts/eum/utils/eumCommon';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import websiteCreateRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertTypography from 'in-alerting/components/AlertTypography';
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
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const thresholdType = (warningThresholdField ?? criticalThresholdField).get('type')?.value;
  const seasonality = form.get('threshold')?.get('warningThreshold').get('seasonality')?.value;
  const options = thresholdTypeOptions.filter(getOptionsFilterForThresholdTyp(thresholdType));
  const thresholdComboBoxValue = getMultiThresholdComboBoxValue(form);
  const websiteOnThresholdTypeChange = useOnThresholdTypeChange(websiteCreateRuleForm);
  const mobileAppOnThresholdTypeChange = useOnThresholdTypeChange(mobileAppCreateRuleForm);
  return (
    <Stack gap="xsmall" direction="horizontal">
      {options.length > 1 && (
        <>
          <Stack gap="xsmall">
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
            <AlertTypography
              variant="body-small"
              color="color700"
              content={getThresholdDescription(seasonality ?? thresholdType)}
            />
          </Stack>
          <Spacer vertical="xxsmall" />

          {thresholdType === HISTORIC_BASELINE && (
            <RecalculateMultiThresholdBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
          )}
        </>
      )}
    </Stack>
  );
}
