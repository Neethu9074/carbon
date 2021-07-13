/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  getAvailableOptionsForEvaluationType,
  isOneOfBaselineTypes
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import ShowLabelOrDropdown from 'in-alerting/smart-alerts/applications/advanced/ShowLabelOrDropdown';
import { createSlownessForm } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
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

  return (
    <ShowLabelOrDropdown form={form} isGlobalSmartAlert={isGlobalSmartAlert}>
      <Dropdown
        asSimpleDropdown
        label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
        items={getAvailableOptionsForEvaluationType(thresholdTypeOptions, evaluationType, isGlobalSmartAlert)}
        onChange={({ value = '' }) => {
          const valueParts = value.split('.');
          const thresholdType = valueParts[0];

          let newThresholdForm = createSlownessForm({
            ...form.get('threshold').toJS(),
            type: thresholdType
          });

          if (thresholdType === HISTORIC_BASELINE) {
            const seasonality = valueParts[1];
            newThresholdForm = newThresholdForm.updateIn(['seasonality'], f => f.setValue(seasonality).setTouched());
          }

          const newRuleForm = createRuleForm({ ...form.get('rule').toJS() });

          updateForm(form.put('threshold', newThresholdForm).put('rule', newRuleForm));

          trackThresholdTypeChanged?.(getTrackingObject(form, { value: thresholdType }));
        }}
      />
      {isOneOfBaselineTypes(thresholdType) && (
        <RecalculateBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
      )}
    </ShowLabelOrDropdown>
  );
}

ThresholdTypeSelection.propTypes = {
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  isGlobalSmartAlert: PropTypes.bool,
  thresholdTypeOptions: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }).isRequired,
  trackThresholdTypeChanged: PropTypes.func,
  updateForm: PropTypes.func.isRequired
};
