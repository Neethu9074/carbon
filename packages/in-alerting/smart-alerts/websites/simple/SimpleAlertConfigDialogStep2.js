/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/websites/components/AlertTagFilterExpressionConfig';
import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/websites/simple/SimpleAlertConfigDialogChart';
import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/simple/SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({
  form,
  websiteLabel,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  QueryBuilderComponent
}) {
  return (
    <SimpleModeStepContentWrapper
      headline={t('in-alerting:smartAlerts.websites.simple.simpleAlertConfigDialogStep2Headline')}
    >
      <div className={locals.alertLocationFiltersWrapper}>
        <AlertTagFilterExpressionConfig
          form={form}
          updateForm={updateForm}
          websiteLabel={websiteLabel}
          QueryBuilderComponent={QueryBuilderComponent}
        />
      </div>

      <SimpleAlertConfigDialogChart
        form={form}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      />
    </SimpleModeStepContentWrapper>
  );
}
