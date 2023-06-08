/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Stack, Spacer } from '@instana/components';

//@ts-expect-error TS migration
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateBaselineButton';
import { onThresholdTypeChange as websiteOnThresholdTypeChange } from 'in-alerting/smart-alerts/websites/form/thresholdTypeForm';
import { getOptionsFilterForThresholdTyp } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ThresholdTypesHelp } from 'in-alerting/smart-alerts/components/dialog/ThresholdTypesHelp';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import Dropdown from 'in-alerting/components/Dropdown';

export default function ThresholdTypeSelection({ form, updateForm, editMode, thresholdTypeOptions, eumType }) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const options = thresholdTypeOptions.filter(getOptionsFilterForThresholdTyp(thresholdType));
  const thresholdComboBoxValue = getThresholdComboBoxValue(form);

  return (
    <>
      {options.length === 1 ? (
        <span>{options[0].label}</span>
      ) : (
        <Dropdown
          value={thresholdComboBoxValue}
          items={options}
          onChange={newThresholdTypeWithSeasonality => {
            {
              /* eumType === websiteEum , this condition need to be removed once sesonality is implemented for mobileapp  */
            }
            return eumType === websiteEum
              ? websiteOnThresholdTypeChange(newThresholdTypeWithSeasonality, form, updateForm)
              : '';
          }}
        />
      )}
      {/* eumType === websiteEum , this condition need to be removed once HISTORIC_BASELINE adn ADAPTIVE_BASELINE is implemented for mobileapp  */}
      {eumType === websiteEum && (
        <>
          <Spacer vertical size="xxsmall" />
          <Stack space="xxsmall" align="center" direction="horizontal">
            {options.length > 1 && thresholdType !== ADAPTIVE_BASELINE && <ThresholdTypesHelp />}
            {thresholdType === HISTORIC_BASELINE && (
              <RecalculateBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
            )}
          </Stack>
        </>
      )}
    </>
  );
}

ThresholdTypeSelection.propTypes = {
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  thresholdTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  updateForm: PropTypes.func.isRequired,
  eumType: PropTypes.string.isRequired
};
