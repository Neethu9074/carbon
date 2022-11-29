/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Stack, Spacer } from '@instana/components';

import {
  filterThresholdTypeOptionsForEvaluationType,
  getOptionsFilterForThresholdTyp
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import { applicationsAlertingThresholdTypeHelpIconHovered } from 'in-alerting/smart-alerts/applications/tracker';
import { ThresholdTypesHelp } from 'in-alerting/smart-alerts/components/smart-alert-dialog/ThresholdTypesHelp';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/applications/form/thresholdTypeForm';
import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import Dropdown from 'in-alerting/components/Dropdown';

export default function ThresholdTypeSelection({
  form,
  updateForm,
  editMode,
  isGlobalSmartAlert,
  showThresholdsHint,
  blueprintType,
  trackThresholdTypeChanged,
  thresholdTypeOptions
}) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const evaluationType = form.get('evaluationType').value;
  const options = filterThresholdTypeOptionsForEvaluationType(
    thresholdTypeOptions,
    evaluationType,
    isGlobalSmartAlert
  ).filter(getOptionsFilterForThresholdTyp(thresholdType));
  const thresholdComboBoxValue = getThresholdComboBoxValue(form);

  return (
    <>
      {options.length === 1 ? (
        <span>{options[0].label}</span>
      ) : (
        <Dropdown
          asSimpleDropdown
          value={thresholdComboBoxValue}
          items={options}
          onChange={value => {
            onThresholdTypeChange(value, form, updateForm, trackThresholdTypeChanged);
          }}
        />
      )}
      <Spacer vertical size="xxsmall" />
      <Stack space="xxsmall" align="center" direction="horizontal">
        {options.length > 1 && showThresholdsHint && thresholdType !== ADAPTIVE_BASELINE && (
          <ThresholdTypesHelp
            trackHover={() => applicationsAlertingThresholdTypeHelpIconHovered({ blueprintType, thresholdType })}
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
  isGlobalSmartAlert: PropTypes.bool,
  showThresholdsHint: PropTypes.bool,
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
