import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-applications/alerting/simple/SimpleAlertConfigDialogChart';
import AlertFilterConfigurator from 'in-new-components/Alerting/components/AlertFilterConfigurator';
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
            <div className={locals.alertFiltersWrapper}>
              <h2>Filters for AP: {applicationLabel} </h2>
              <AlertFilterConfigurator queryBuilderComponent={AlertQueryBuilder} form={form} updateForm={updateForm} />
            </div>
          )}
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
