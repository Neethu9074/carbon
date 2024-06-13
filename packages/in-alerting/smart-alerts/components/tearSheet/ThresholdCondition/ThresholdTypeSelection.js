/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Select } from '@instana/components';

import {
  filterThresholdTypeOptionsForEvaluationType,
  getOptionsFilterForThresholdTyp
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { tearSheetStaticOrAdaptiveThresholds } from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/config';
import { staticOrAdaptiveThresholds as types } from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/config';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/applications/form/thresholdTypeForm';
import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep4.mless';

export default function ThresholdTypeSelection({
  form,
  updateForm,
  editMode,
  isGlobalSmartAlert,
  thresholdTypeOptions,
  blueprintConfig
}) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const evaluationType = form.get('evaluationType').value;
  const options = filterThresholdTypeOptionsForEvaluationType(
    thresholdTypeOptions,
    evaluationType,
    isGlobalSmartAlert
  ).filter(getOptionsFilterForThresholdTyp(thresholdType));

  const thresholdComboBoxValue = getThresholdComboBoxValue(form);
  const currentType = thresholdType === ADAPTIVE_BASELINE ? types.adaptive : types.static;
  const { description, label } = tearSheetStaticOrAdaptiveThresholds.info[currentType];

  return (
    <>
      {options.length === 1 ? (
        <>
          {!blueprintConfig?.baselineEnabled && (
            <div className={locals.container}>
              <span className={locals.label}>
                <AlertTypography
                  variant="body-regular"
                  color="color900"
                  content={t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdType')}
                />
              </span>
              <AlertTypography variant="body-bold" content={label} color={'teal500'}>
                <div>
                  <AlertTypography variant="body-small" content={description} color={'color700'} />
                </div>
              </AlertTypography>
            </div>
          )}
        </>
      ) : (
        <div className={locals.container}>
          <span className={locals.label} />
          <Select
            value={thresholdComboBoxValue}
            items={options}
            onChange={e => {
              onThresholdTypeChange(e.target.value, form, updateForm);
            }}
            useFullWidth
            wrapperClassName={locals.fullWidth}
          >
            {options.map(items => {
              return (
                <option key={items.value} value={items.value}>
                  {items.label}
                </option>
              );
            })}
          </Select>
          {thresholdType === HISTORIC_BASELINE && (
            <RecalculateBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
          )}
        </div>
      )}
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
  updateForm: PropTypes.func.isRequired,
  blueprintConfig: PropTypes.object.isRequired
};
