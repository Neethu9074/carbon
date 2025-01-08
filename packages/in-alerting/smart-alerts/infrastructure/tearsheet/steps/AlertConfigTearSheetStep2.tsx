/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Spacer } from '@instana/components';

import ThresholdViolation from 'in-alerting/smart-alerts/infrastructure/tearsheet/components/ThresholdViolation';
import { ThresholdChart } from 'in-alerting/smart-alerts/infrastructure/tearsheet/components/ThresholdChart';
import ForecastAlerting from 'in-alerting/smart-alerts/infrastructure/tearsheet/components/ForecastAlerting';
import ThresholdSection from 'in-alerting/smart-alerts/infrastructure/tearsheet/components/ThresholdSection';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { oneMinuteGranularityForStaticThresholdEnabled } from 'in-services/featureFlags';
import GracePeriodWrapper from 'in-alerting/smart-alerts/components/tearSheet/GracePeriodWrapper';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep2.mless';

export interface Marks {
  label: string;
  millis: number;
  value: number;
}

export default function AlertConfigTearSheetStep2({
  form,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
}) {
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const oneMinuteGranularityAllowed =
    thresholdType === STATIC_THRESHOLD && oneMinuteGranularityForStaticThresholdEnabled;

  return (
    <>
      <div className={locals.container60_40}>
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.infrastructure.tearSheet.step2.header')}
          description={t('in-alerting:smartAlerts.infrastructure.tearSheet.step2.description')}
        >
          <ThresholdSection
            form={form}
            updateForm={updateForm}
            oneMinuteGranularityAllowed={oneMinuteGranularityAllowed}
          />
        </TearSheetStepTitleWrapper>
        <span className={locals.seperator} />
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.infrastructure.tearSheet.timeThreshold.title')}
          description={t('in-alerting:smartAlerts.infrastructure.tearSheet.timeThreshold.description')}
        >
          <ThresholdViolation
            form={form}
            updateForm={updateForm}
            oneMinuteGranularityAllowed={oneMinuteGranularityAllowed}
          />
          <Spacer size="gutter" />
          <GracePeriodWrapper form={form} updateForm={updateForm} />
          <Spacer size="gutter" />
          <ForecastAlerting form={form} updateForm={updateForm} />
        </TearSheetStepTitleWrapper>
      </div>
      <ThresholdChart
        form={form}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      />
    </>
  );
}
