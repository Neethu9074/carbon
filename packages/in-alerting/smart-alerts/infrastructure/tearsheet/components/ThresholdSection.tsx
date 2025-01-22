/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import { getFormatter, getMetricUnitPostfix } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import MultiThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/Section/MultiThresholdCondition';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import EvaluationWindow from 'in-alerting/smart-alerts/components/tearSheet/EvaluationWindow';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import { alertChannelPerSeverityInfraSaEnabled } from 'in-services/featureFlags';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

export default function ThresholdSection({
  form,
  updateForm,
  oneMinuteGranularityAllowed
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  oneMinuteGranularityAllowed: boolean;
}) {
  const groupBy = form.get('groupBy').value;

  const ruleForm = form.get('rule');
  const entityType = ruleForm.get('entityType').value;
  const metricName = ruleForm.get('metricName').value;
  const aggregation = ruleForm.get('aggregation');

  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);

  const formatter = getFormatter(entityType, metricName);
  const percentageMetric = formatter === 'PERCENTAGE';
  const metricUnitPostfix = getMetricUnitPostfix(formatter);

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
        <AlertTypography variant="body-bold" color="color900" content={metricLabel} />
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
            content={t('in-alerting:smartAlerts.infrastructure.tearSheet.thresholdDescription.static')}
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
        <MultiThresholdCondition
          form={form}
          updateForm={updateForm}
          percentageMetric={percentageMetric}
          metricUnitPostfix={metricUnitPostfix}
          groupBy={groupBy}
          alertChannelPerSeverityEnabled={alertChannelPerSeverityInfraSaEnabled}
        />
      </Section>

      {/* Time window */}
      <EvaluationWindow form={form} updateForm={updateForm} oneMinuteGranularityAllowed={oneMinuteGranularityAllowed} />
    </Stack>
  );
}
