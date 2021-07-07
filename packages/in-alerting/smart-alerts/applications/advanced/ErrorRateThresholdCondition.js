/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import ThresholdValueFormGroupForStaticThreshold from 'in-alerting/smart-alerts/applications/advanced/ThresholdValueFormGroupForStaticThreshold';
import FixedThresholdConditionForBuiltInAlert from 'in-alerting/smart-alerts/applications/advanced/FixedThresholdConditionForBuiltInAlert';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import { applicationsAlertingThresholdOperatorChanged } from 'in-alerting/smart-alerts/applications/tracker';
import ThresholdLabel from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdLabel';
import { getOperatorLabel } from 'in-alerting/smart-alerts/applications/advanced/thresholdConditionUtil';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import { t } from 'in-i18n';

import interactiveChartLocals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/InteractiveChart.mless';

export default function ErrorRateThresholdCondition({ form, onChange, updateForm, blueprintConfig }) {
  const isBuiltIn = form.get('builtIn').value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <>
      <ThresholdConditionFormGroup>
        {isBuiltIn ? (
          <FixedThresholdConditionForBuiltInAlert
            metricLabel={blueprintConfig.getMetricLabel(metricName)}
            operatorLabel={getOperatorLabel(form)}
            configuredThreshold={t(
              'in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold'
            )}
          />
        ) : (
          <>
            <ThresholdLabel>{blueprintConfig.getMetricLabel(metricName)}</ThresholdLabel>
            <ThresholdOperatorDropDown
              form={form}
              onChange={onChange}
              trackingCallback={applicationsAlertingThresholdOperatorChanged}
            />
            <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')}</div>
          </>
        )}
      </ThresholdConditionFormGroup>

      <ThresholdValueFormGroupForStaticThreshold
        form={form}
        updateForm={updateForm}
        maxValue={maxValue}
        metricUnitPostfix={metricUnitPostfix}
        onChange={onChange}
        thresholdValueInputClassName={interactiveChartLocals.narrowControl}
        percentageMetric
      />
    </>
  );
}

ErrorRateThresholdCondition.propTypes = {
  form: PropTypes.object.isRequired,
  blueprintConfig: blueprintConfigPropType,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired
};
