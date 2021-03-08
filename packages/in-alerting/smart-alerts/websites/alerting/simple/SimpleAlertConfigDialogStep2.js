/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/websites/alerting/components/AlertTagFilterExpressionConfig';
import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/websites/alerting/simple/SimpleAlertConfigDialogChart';
import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import AlertLocationFilters from 'in-alerting/smart-alerts/websites/alerting/components/AlertLocationFilters';
import WithQB1orQB2 from 'in-alerting/components/WithQB1orQB2';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/alerting/simple/SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({
  form,
  timeConfig,
  websiteLabel,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  QueryBuilderComponent
}) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-websites:alerting.simple.simpleAlertConfigDialogStep2Headline')}>
      <div className={locals.alertLocationFiltersWrapper}>
        <WithQB1orQB2
          onUsesQB1={() => (
            <AlertLocationFilters
              form={form}
              websiteLabel={websiteLabel}
              timeConfig={timeConfig}
              updateForm={updateForm}
            />
          )}
          onUsesQB2={() => (
            <AlertTagFilterExpressionConfig
              form={form}
              updateForm={updateForm}
              websiteLabel={websiteLabel}
              QueryBuilderComponent={QueryBuilderComponent}
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
