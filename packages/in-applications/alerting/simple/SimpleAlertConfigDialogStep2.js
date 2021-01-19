/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import AlertTagFilterExpressionConfig from 'in-new-components/Alerting/components/AlertTagFilterExpressionConfig';
import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-applications/alerting/simple/SimpleAlertConfigDialogChart';
import AlertLocationFilters from 'in-applications/alerting/components/AlertLocationFilters';
import AlertQueryBuilder from 'in-applications/alerting/components/AlertQueryBuilder';
import WithQB1orQB2 from 'in-new-components/Alerting/components/WithQB1orQB2';

import locals from './SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({
  form,
  timeConfig,
  applicationLabel,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  return (
    <SimpleModeStepContentWrapper headline="Where do you want the alert to trigger?">
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
            <AlertTagFilterExpressionConfig
              form={form}
              updateForm={updateForm}
              applicationLabel={applicationLabel}
              QueryBuilderComponent={AlertQueryBuilder}
              headerTransparent
            />
          )}
          shouldFallbackToQB2={isQB2Config => isQB2Config(form.get('convertedTagFilterExpression').value)}
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
