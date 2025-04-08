/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import ThresholdValueFormGroupForMultiStaticThreshold from 'in-alerting/smart-alerts/dialog/advanced/ThresholdValueFormGroupForMultiStaticThreshold';
import { MultiThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/dialog/advanced/MultiThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { getAggregationValue } from 'in-alerting/smart-alerts/applications/dialog/advanced/thresholdConditionUtil';
import ThresholdTypeSelection from 'in-alerting/smart-alerts/eum/components/ThresholdTypeSelection';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/dialog/form/ruleForm';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/dialog.mless';

export default function SlownessThresholdCondition({ form, updateForm, blueprintConfig, editMode }) {
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const thresholdTypeOptions = blueprintConfig.getThresholdTypeOptions();
  return (
    <>
      <ThresholdConditionFormGroup>
        <Dropdown
          value={metricName}
          items={ruleMetricNameOptions.slowness}
          className={locals.dropdownmd}
          onChange={value => {
            updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));
          }}
        />
        <Dropdown
          value={getAggregationValue(form)}
          items={getAggregationOptions(form)}
          className={locals.dropdownsm}
          onChange={value => {
            updateForm(form.updateIn(['rule', 'aggregation'], f => f.setValue(value).setTouched(true)));
          }}
        />
        <ThresholdOperatorDropDown form={form} updateForm={updateForm} allOptions />
        <ThresholdTypeSelection
          form={form}
          updateForm={updateForm}
          editMode={editMode}
          thresholdTypeOptions={thresholdTypeOptions}
          showThresholdsHint
          eumType={websiteEum}
        />
      </ThresholdConditionFormGroup>

      {thresholdType === STATIC_THRESHOLD && (
        <ThresholdValueFormGroupForMultiStaticThreshold
          form={form}
          updateForm={updateForm}
          maxValue={maxValue}
          metricUnitPostfix={metricUnitPostfix}
          label={t('in-alerting:smartAlerts.websites.advanced.thresholdValue')}
        />
      )}

      {thresholdType !== STATIC_THRESHOLD && (
        <MultiThresholdDeviationSliderForm form={form} updateForm={updateForm} defaultValue={defaultDeviationFactor} />
      )}
    </>
  );
}

SlownessThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};
