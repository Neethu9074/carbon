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
import RecalculateMultiThresholdBaselineButton from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateMultiThresholdBaselineButton';
import { getMultiThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/applications/form/thresholdTypeForm';
import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ThresholdTypesHelp } from 'in-alerting/smart-alerts/components/dialog/ThresholdTypesHelp';
import Dropdown from 'in-alerting/components/Dropdown';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/dialog.mless';

export default function ThresholdTypeSelection({
  form,
  updateForm,
  editMode,
  isGlobalSmartAlert,
  showThresholdsHint,
  thresholdTypeOptions
}) {
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const evaluationType = form.get('evaluationType').value;
  const options = filterThresholdTypeOptionsForEvaluationType(
    thresholdTypeOptions,
    evaluationType,
    isGlobalSmartAlert
  ).filter(getOptionsFilterForThresholdTyp(thresholdType));
  const thresholdComboBoxValue = getMultiThresholdComboBoxValue(form);

  return (
    <>
      {options.length === 1 ? (
        <span>{options[0].label}</span>
      ) : (
        <Dropdown
          className={locals.dropdownxlg}
          value={thresholdComboBoxValue}
          items={options}
          onChange={newThresholdTypeWithSeasonality => {
            onThresholdTypeChange(newThresholdTypeWithSeasonality, form, updateForm);
          }}
        />
      )}
      <Spacer vertical size="xxsmall" />
      <Stack space="xsmall" align="center" direction="horizontal">
        {options.length > 1 && showThresholdsHint && thresholdType !== ADAPTIVE_BASELINE && <ThresholdTypesHelp />}
        {thresholdType === HISTORIC_BASELINE && (
          <RecalculateMultiThresholdBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
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
  thresholdTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  updateForm: PropTypes.func.isRequired
};
