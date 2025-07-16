/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import LogMultiThresholdCondition from 'in-alerting/smart-alerts/logs/tearsheet/components/LogMultiThresholdCondition';
import EvaluationWindow from 'in-alerting/smart-alerts/components/tearSheet/EvaluationWindow';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import { alertChannelPerSeverityLogSaEnabled } from 'in-services/featureFlags';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

export default function ThresholdSection({
  form,
  updateForm
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}) {
  return (
    <Stack direction="vertical" gap="gutter" align="start">
      {/* Metric name */}
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
        <AlertTypography
          variant="body-bold"
          color="color900"
          content={t('in-alerting:smartAlerts.logs.alertDetails.metricName')}
        />
      </Section>

      {/* threshold type */}
      <Section
        title={
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.details.thresholdTypeTitle')}
          />
        }
        titleWidth="8rem"
      >
        <Stack gap="disabled" align="start">
          <AlertTypography
            variant="body-bold"
            color="color900"
            content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.static')}
          />
          <AlertTypography
            variant="body-small"
            color="color900"
            content={t('in-alerting:smartAlerts.logs.tearSheet.thresholdDescription.static')}
          />
        </Stack>
      </Section>

      {/* Threshold value */}
      <Section
        title={
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.thresholdValue')}
          />
        }
        titleWidth="8rem"
      >
        <LogMultiThresholdCondition
          form={form}
          updateForm={updateForm}
          percentageMetric={false}
          metricUnitPostfix={''}
          alertChannelPerSeverityEnabled={alertChannelPerSeverityLogSaEnabled}
        />
      </Section>
      {/* Evaluation Window */}
      <EvaluationWindow form={form} updateForm={updateForm} smartAlertType="logSA" />
    </Stack>
  );
}
