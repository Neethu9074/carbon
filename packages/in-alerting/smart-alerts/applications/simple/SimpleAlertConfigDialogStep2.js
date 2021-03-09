/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/applications/simple/SimpleAlertConfigDialogChart';
import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import AlertLocationFilters from 'in-alerting/smart-alerts/applications/components/AlertLocationFilters';
import ScopeConfig from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ScopeConfig';
import WithQB1orQB2 from 'in-alerting/components/WithQB1orQB2';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/simple/SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({
  form,
  timeConfig,
  applicationLabel,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  QueryBuilderComponent
}) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-alerting:smartAlerts.applications.simple.simpleAlertStep2Headline')}>
      <div className={locals.alertLocationFiltersWrapper}>
        <WithQB1orQB2
          onUsesQB1={() => (
            <AlertLocationFilters
              form={form}
              applicationLabel={applicationLabel}
              timeConfig={timeConfig}
              updateForm={updateForm}
              withoutLatencyItem
            />
          )}
          onUsesQB2={() => (
            <ScopeConfig
              form={form}
              updateForm={updateForm}
              QueryBuilderComponent={QueryBuilderComponent}
              timeConfig={timeConfig}
              headerTransparent
            />
          )}
          shouldFallbackToQB2={isQB2Config => isQB2Config(form.get('convertedTagFilterExpression').value)}
        />
      </div>

      <div className={locals.stickyChart}>
        <SimpleAlertConfigDialogChart
          form={form}
          onChartViewConfigChange={onChartViewConfigChange}
          selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        />
      </div>
    </SimpleModeStepContentWrapper>
  );
}
