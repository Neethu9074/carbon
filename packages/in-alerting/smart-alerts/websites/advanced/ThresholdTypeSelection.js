/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Stack, Spacer } from '@instana/components';

import {
  websitesAlertingThresholdTypeHelpIconHovered,
  websitesAlertingThresholdTypeChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import { getOptionsFilterForThresholdTyp } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { ThresholdTypesHelp } from 'in-alerting/smart-alerts/components/smart-alert-dialog/ThresholdTypesHelp';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { findEntryByValue } from 'in-alerting/smart-alerts/components/utils/formUtils';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import Dropdown from 'in-alerting/components/Dropdown';

export default function ThresholdTypeSelection({
  form,
  updateForm,
  editMode,
  blueprintType,
  thresholdType,
  thresholdTypeOptions
}) {
  const value = (findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form)) ?? thresholdTypeOptions[0])
    ?.value;

  const options = thresholdTypeOptions.filter(getOptionsFilterForThresholdTyp(thresholdType));

  return (
    <>
      {options.length === 1 ? (
        <span>{options[0].label}</span>
      ) : (
        <Dropdown
          asSimpleDropdown
          items={options}
          value={value}
          onChange={newThresholdTypeWithSeasonality => {
            const valueParts = newThresholdTypeWithSeasonality.split('.');
            const newThresholdType = valueParts[0];

            let newThresholdForm = createThresholdForm(
              {
                ...form.get('threshold').toJS(),
                type: newThresholdType
              },
              form.get('rule').get('alertType').value
            );

            if (valueParts.length > 1) {
              const newSeasonality = valueParts[1];
              newThresholdForm = newThresholdForm.updateIn(['seasonality'], f =>
                f.setValue(newSeasonality).setTouched()
              );
            }

            const ruleWithoutAggregation = { ...form.get('rule').toJS(), aggregation: null };
            // aggregation will be reset to default value
            const newRuleForm = createRuleForm(ruleWithoutAggregation);

            updateForm(form.put('threshold', newThresholdForm).put('rule', newRuleForm));

            websitesAlertingThresholdTypeChanged(getTrackingObject(form, { value: newThresholdType }));
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
  thresholdType: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired
};
