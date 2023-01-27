/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Stack, Spacer } from '@instana/components';

import { getOptionsFilterForThresholdTyp } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { websitesAlertingThresholdTypeHelpIconHovered } from 'in-alerting/smart-alerts/websites/tracker';
import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ThresholdTypesHelp } from 'in-alerting/smart-alerts/components/dialog/ThresholdTypesHelp';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/websites/form/thresholdTypeForm';
import Dropdown from 'in-alerting/components/Dropdown';

export default function ThresholdTypeSelection({
  form,
  updateForm,
  editMode,
  blueprintType,
  trackThresholdTypeChanged,
  thresholdTypeOptions
}) {
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
            onThresholdTypeChange(newThresholdTypeWithSeasonality, form, updateForm, trackThresholdTypeChanged);
          }}
        />
      )}
      <Spacer vertical size="xxsmall" />
      <Stack space="xxsmall" align="center" direction="horizontal">
        {options.length > 1 && thresholdType !== ADAPTIVE_BASELINE && (
          <ThresholdTypesHelp
            trackHover={() => websitesAlertingThresholdTypeHelpIconHovered({ blueprintType, thresholdType })}
          />
        )}
        {thresholdType === HISTORIC_BASELINE && (
          <RecalculateBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
        )}
      </Stack>
    </>
  );
}

ThresholdTypeSelection.propTypes = {
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  /** optional, only used when tracking the hovering of the help icon */
  blueprintType: PropTypes.string,
  thresholdTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  trackThresholdTypeChanged: PropTypes.func,
  updateForm: PropTypes.func.isRequired
};
