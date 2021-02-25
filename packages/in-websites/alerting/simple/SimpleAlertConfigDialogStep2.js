/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import AlertTagFilterExpressionConfig, {
  inPackages
} from 'in-new-components/Alerting/components/AlertTagFilterExpressionConfig';
import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-websites/alerting/simple/SimpleAlertConfigDialogChart';
import AlertLocationFilters from 'in-websites/alerting/components/AlertLocationFilters';
import WithQB1orQB2 from 'in-new-components/Alerting/components/WithQB1orQB2';

import locals from './SimpleAlertConfigDialogStep2.mless';

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
              label={websiteLabel}
              inPackage={inPackages.IN_WEBSITES}
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
