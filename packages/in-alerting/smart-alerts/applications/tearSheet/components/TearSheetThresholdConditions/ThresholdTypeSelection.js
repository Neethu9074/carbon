/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Stack, Spacer } from '@instana/components';

import {
  filterThresholdTypeOptionsForEvaluationType,
  getOptionsFilterForThresholdTyp
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/applications/form/thresholdTypeForm';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import Dropdown from 'in-alerting/components/Dropdown';

export default function ThresholdTypeSelection({
  form,
  updateForm,
  editMode,
  isGlobalSmartAlert,
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
          value={thresholdComboBoxValue}
          items={options}
          onChange={newThresholdTypeWithSeasonality => {
            onThresholdTypeChange(newThresholdTypeWithSeasonality, form, updateForm);
          }}
        />
      )}
      <Spacer vertical size="xxsmall" />
      <Stack space="xxsmall" align="center" direction="horizontal">
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
  thresholdTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  updateForm: PropTypes.func.isRequired
};
