/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Spacer } from '@instana/components';

import ThresholdViolation from 'in-alerting/smart-alerts/infrastructure/tearsheet/components/ThresholdViolation';
import ThresholdSection from 'in-alerting/smart-alerts/infrastructure/tearsheet/components/ThresholdSection';
import { ThresholdChart } from 'in-alerting/smart-alerts/infrastructure/tearsheet/components/ThresholdChart';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { oneMinuteGranularityForStaticThresholdEnabled } from 'in-services/featureFlags';
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
  const thresholdType = form.get('threshold').get('type')?.value;
  const oneMinuteGranularityAllowed =
    thresholdType === STATIC_THRESHOLD && oneMinuteGranularityForStaticThresholdEnabled;

  return (
    <>
      <div className={locals.container60_40}>
        <TearSheetStepContentWrapper
          headline={t('in-alerting:smartAlerts.infrastructure.tearSheet.step2.header')}
          description={t('in-alerting:smartAlerts.infrastructure.tearSheet.step2.description')}
        >
          <Spacer size="gutter" />
          <ThresholdSection
            form={form}
            updateForm={updateForm}
            oneMinuteGranularityAllowed={oneMinuteGranularityAllowed}
          />
        </TearSheetStepContentWrapper>
        <span className={locals.seperator} />
        <TearSheetStepContentWrapper
          headline={t('in-alerting:smartAlerts.infrastructure.tearSheet.timeThreshold.title')}
          description={t('in-alerting:smartAlerts.infrastructure.tearSheet.timeThreshold.description')}
        >
          <Spacer size="gutter" />
          <ThresholdViolation
            form={form}
            updateForm={updateForm}
            oneMinuteGranularityAllowed={oneMinuteGranularityAllowed}
          />
        </TearSheetStepContentWrapper>
      </div>
      <ThresholdChart
        form={form}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      />
    </>
  );
}
