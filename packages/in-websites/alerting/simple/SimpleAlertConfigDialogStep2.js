/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-websites/alerting/simple/SimpleAlertConfigDialogChart';
import AlertLocationFilters from 'in-websites/alerting/components/AlertLocationFilters';

import locals from './SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({
  form,
  timeConfig,
  websiteLabel,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-websites:alerting.simple.simpleAlertConfigDialogStep2Headline')}>
      <div className={locals.alertLocationFiltersWrapper}>
        <AlertLocationFilters form={form} websiteLabel={websiteLabel} timeConfig={timeConfig} updateForm={updateForm} />
      </div>

      <SimpleAlertConfigDialogChart
        form={form}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      />
    </SimpleModeStepContentWrapper>
  );
}
