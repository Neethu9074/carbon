/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { ThresholdChart } from 'in-alerting/smart-alerts/logs/tearsheet/components/ThresholdChart';
import ThresholdSection from 'in-alerting/smart-alerts/logs/tearsheet/components/ThresholdSection';
import ThresholdViolation from 'in-alerting/smart-alerts/components/tearSheet/ThresholdViolation';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { oneMinuteGranularityForStaticThresholdEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/tearsheet/steps/AlertConfigTearSheetStep2.mless';

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
  return (
    <>
      <div className={locals.container60_40}>
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.logs.tearSheet.step2.header')}
          description={t('in-alerting:smartAlerts.logs.tearSheet.step2.description')}
        >
          <ThresholdSection
            form={form}
            updateForm={updateForm}
            oneMinuteGranularityAllowed={oneMinuteGranularityForStaticThresholdEnabled}
          />
        </TearSheetStepTitleWrapper>
        <span className={locals.seperator} />
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.logs.tearSheet.timeThreshold.title')}
          description={t('in-alerting:smartAlerts.logs.tearSheet.timeThreshold.description')}
        >
          <ThresholdViolation
            form={form}
            updateForm={updateForm}
            oneMinuteGranularityAllowed={oneMinuteGranularityForStaticThresholdEnabled}
          />
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
