/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  getAvailableOptionsForEvaluationType,
  optionsValidForThresholdTyp
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import ShowStaticThresholdLabelOrDropdown from 'in-alerting/smart-alerts/applications/advanced/ShowStaticThresholdLabelOrDropdown';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/applications/form/thresholdTypeForm';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import Dropdown from 'in-alerting/components/Dropdown';

export default function ThresholdTypeSelection({
  form,
  updateForm,
  editMode,
  isGlobalSmartAlert,
  trackThresholdTypeChanged,
  thresholdTypeOptions
}) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const evaluationType = form.get('evaluationType').value;
  const options = getAvailableOptionsForEvaluationType(thresholdTypeOptions, evaluationType, isGlobalSmartAlert).filter(
    optionsValidForThresholdTyp(thresholdType)
  );
  return (
    <ShowStaticThresholdLabelOrDropdown evaluationType={evaluationType} isGlobalSmartAlert={isGlobalSmartAlert}>
      {options.length === 1 ? (
        <span>{options[0].label}</span>
      ) : (
        <Dropdown
          asSimpleDropdown
          label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
          items={options}
          onChange={({ value = '' }) => {
            onThresholdTypeChange(value, form, updateForm, trackThresholdTypeChanged);
          }}
        />
      )}
      {thresholdType === HISTORIC_BASELINE && (
        <RecalculateBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
      )}
    </ShowStaticThresholdLabelOrDropdown>
  );
}

ThresholdTypeSelection.propTypes = {
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  isGlobalSmartAlert: PropTypes.bool,
  thresholdTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  trackThresholdTypeChanged: PropTypes.func,
  updateForm: PropTypes.func.isRequired
};
