/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  createViolationsInSequenceForm,
  defaultAdaptiveBaselineTimeWindow
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import ShowStaticThresholdLabelOrDropdown from 'in-alerting/smart-alerts/applications/advanced/ShowStaticThresholdLabelOrDropdown';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import { getAvailableOptionsForEvaluationType } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { defaultAdaptiveBaselineGranularity } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { removeExcludedFilters } from 'in-alerting/smart-alerts/components/utils/tagfilterExpressionUtils';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { tagKeysSupportedByMaterializedView } from 'in-alerting/smart-alerts/applications/tags';
import { createSlownessForm } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
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
  const options = getAvailableOptionsForEvaluationType(thresholdTypeOptions, evaluationType, isGlobalSmartAlert);

  return (
    <ShowStaticThresholdLabelOrDropdown evaluationType={evaluationType} isGlobalSmartAlert={isGlobalSmartAlert}>
      {options.length === 1 ? (
        <span>{options[0].label}</span>
      ) : (
        <Dropdown
          asSimpleDropdown
          label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
          items={options}
          onChange={({ value = '' }) => onThresholdTypeChange(value)}
        />
      )}
      {thresholdType === HISTORIC_BASELINE && (
        <RecalculateBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
      )}
    </ShowStaticThresholdLabelOrDropdown>
  );

  function onThresholdTypeChange(value) {
    const valueParts = value.split('.');
    const updatedThresholdType = valueParts[0];

    let newThresholdForm = createSlownessForm({
      ...form.get('threshold').toJS(),
      type: updatedThresholdType
    });

    if (updatedThresholdType === HISTORIC_BASELINE) {
      const seasonality = valueParts[1];
      newThresholdForm = newThresholdForm.updateIn(['seasonality'], f => f.setValue(seasonality).setTouched());
    }

    const newRuleForm = createRuleForm({ ...form.get('rule').toJS() });

    let updatedForm = form.put('threshold', newThresholdForm).put('rule', newRuleForm);

    if (updatedThresholdType === ADAPTIVE_BASELINE) {
      // resetting granularity and timeThreshold when threshold type is switched to adaptive-baseline
      updatedForm = updatedForm
        .put(
          'timeThreshold',
          createViolationsInSequenceForm(
            {
              timeWindow: defaultAdaptiveBaselineTimeWindow,
              type: 'violationsInSequence'
            },
            ADAPTIVE_BASELINE
          )
        )
        .updateIn(['granularity'], f => f.setValue(defaultAdaptiveBaselineGranularity).setTouched(true));
    }

    updateForm(updatedForm);

    trackThresholdTypeChanged?.(getTrackingObject(form, { value: updatedThresholdType }));
  }
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
