/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Field } from 'formalistic';
import React from 'react';

import { Spacer, Stack } from '@instana/components';

import {
  getMarksForThresholdType,
  getDefaultMark
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/ConfigureGranularity';
import { getFormatter, getMetricUnitPostfix } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import MultiThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/Section/MultiThresholdCondition';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { Marks } from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep2';
import DebouncedRestrictedSlider from 'in-components/Slider/DebouncedRestrictedSlider';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import { alertChannelPerSeverityInfraSaEnabled } from 'in-services/featureFlags';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep2.mless';

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
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const granularity = form.get('granularity')?.value;

  const marks = getMarksForThresholdType(thresholdType, oneMinuteGranularityAllowed);
  const foundMark = marks.find((i: Marks) => i.millis === granularity) ?? getDefaultMark(marks, thresholdType);
  const currentValue = foundMark.value;

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
      <Section
        title={
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.timeWindow')}
          />
        }
        titleWidth="8rem"
      >
        <div className={locals.fullWidth}>
          <DebouncedRestrictedSlider
            marks={marks}
            max={marks[marks.length - 1].value}
            min={0}
            value={currentValue}
            onChange={value => {
              onChangeGranularity(minutes.toMillis(value), form, updateForm);
            }}
            valueLabelDisplay="off"
          />
          <Spacer size="normal" />
          <AlertTypography
            variant="body-small"
            color="color600"
            content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.granularity.description', {
              granularity: currentValue
            })}
          />
        </div>
      </Section>
    </Stack>
  );
}

function onChangeGranularity(newGranularity: number, form: MapForm<any>, updateForm: (form: MapForm<any>) => void) {
  const oldGranularity = form.get('granularity').value;
  const oldTimeWindow = form.get('timeThreshold').get('timeWindow').value;

  const calculatedViolation = (oldTimeWindow / oldGranularity).toString();

  const violations = parseInt(calculatedViolation);

  updateForm(
    form
      .updateIn(['granularity'], f => f.setValue(newGranularity).setTouched(true))
      .updateIn(['timeThreshold', 'timeWindow'], f =>
        (f as Field<number>).setValue(violations * newGranularity).setTouched(true)
      )
  );
}
