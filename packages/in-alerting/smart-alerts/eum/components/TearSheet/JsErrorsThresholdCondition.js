/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Stack } from '@instana/components';

import MultiThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/Section/MultiThresholdCondition';
import { getMetricUnitPostfix, isPercentageMetric } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import AlertTypography from 'in-alerting/components/AlertTypography';
import Dropdown from 'in-alerting/components/Dropdown';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdCondition.mless';

export default function JsErrorsThresholdCondition({
  form,
  blueprintConfig,
  updateForm,
  alertChannelPerSeverityEnabled
}) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const percentageMetric = isPercentageMetric(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <Stack gap="medium">
      {/* metric dropdown */}
      <Section
        title={
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.details.metricTitle')}
          />
        }
        titleWidth="8rem"
      >
        <Dropdown
          value={metricName}
          items={ruleMetricNameOptions.specificJsError}
          className={locals.dropdownsm}
          onChange={value => {
            updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true)));
          }}
        />
      </Section>

      {/* Threshold Value */}

      <Section
        title={
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.websites.advanced.thresholdValue')}
          />
        }
        titleWidth="8rem"
      >
        {/* Threshold input field */}
        <MultiThresholdCondition
          form={form}
          updateForm={updateForm}
          maxValue={maxValue}
          metricUnitPostfix={metricUnitPostfix}
          percentageMetric={percentageMetric}
          label={t('in-alerting:smartAlerts.websites.advanced.thresholdValue')}
          alertChannelPerSeverityEnabled={alertChannelPerSeverityEnabled}
        />
      </Section>
    </Stack>
  );
}

JsErrorsThresholdCondition.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  alertChannelPerSeverityEnabled: PropTypes.bool.isRequired
};
