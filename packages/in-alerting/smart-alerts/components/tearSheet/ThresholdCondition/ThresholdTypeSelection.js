/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Select, Stack } from '@instana/components';

import {
  filterThresholdTypeOptionsForEvaluationType,
  getOptionsFilterForThresholdTyp
} from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import RecalculateMultiThresholdBaselineButton from 'in-alerting/smart-alerts/components/dialog/advanced/RecalculateMultiThresholdBaselineButton';
import { getMultiThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/applications/form/thresholdTypeForm';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { DAILY, WEEKLY } from 'in-alerting/smart-alerts/data/seasonalities';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/tearSheet/steps/AlertConfigTearSheetStep4.mless';

export default function ThresholdTypeSelection({
  form,
  updateForm,
  editMode,
  isGlobalSmartAlert,
  thresholdTypeOptions
}) {
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const evaluationType = form.get('evaluationType').value;
  const seasonality = form.get('threshold')?.get('warningThreshold').get('seasonality')?.value;
  const options = filterThresholdTypeOptionsForEvaluationType(
    thresholdTypeOptions,
    evaluationType,
    isGlobalSmartAlert
  ).filter(getOptionsFilterForThresholdTyp(thresholdType));
  const thresholdComboBoxValue = getMultiThresholdComboBoxValue(form);

  return (
    <>
      {options.length > 1 && (
        <div className={locals.container}>
          <span className={locals.label} />
          <Stack direction="horizontal" gap="small" align="start">
            <Stack direction="vertical" gap="small" align="start">
              <Select
                data-testid="thresholdType"
                value={thresholdComboBoxValue}
                items={options}
                onChange={e => {
                  onThresholdTypeChange(e.target.value, form, updateForm, noop, editMode);
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
              <AlertTypography
                variant="body-small"
                color="color700"
                content={getThresholdDescription(seasonality ?? thresholdType)}
              />
            </Stack>
            {thresholdType === HISTORIC_BASELINE && (
              <RecalculateMultiThresholdBaselineButton updateForm={updateForm} editMode={editMode} form={form} />
            )}
          </Stack>
        </div>
      )}
    </>
  );
}

function getThresholdDescription(threshold) {
  if (threshold === STATIC_THRESHOLD) {
    return t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdDescription.static');
  } else if (threshold === DAILY) {
    return t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdDescription.staticDaily');
  } else if (threshold === WEEKLY) {
    return t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdDescription.staticWeekly');
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
  updateForm: PropTypes.func.isRequired
};
