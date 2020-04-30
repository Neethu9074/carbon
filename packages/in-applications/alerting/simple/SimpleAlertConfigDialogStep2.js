import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/Alerting/simple/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-applications/alerting/simple/SimpleAlertConfigDialogChart';
import AlertLocationFilters from 'in-applications/alerting/components/AlertLocationFilters';

import locals from './SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({
  form,
  timeConfig,
  applicationLabel,
  updateForm,
  onTimeConfigChange,
  indexInitialSelectedTimeConfig
}) {
  return (
    <SimpleModeStepContentWrapper headline="Where do you want the alert to trigger?">
      <div className={locals.alertLocationFiltersWrapper}>
        <AlertLocationFilters
          form={form}
          applicationLabel={applicationLabel}
          timeConfig={timeConfig}
          updateForm={updateForm}
          withoutLatencyItem
        />
      </div>

      <SimpleAlertConfigDialogChart
        form={form}
        onTimeConfigChange={onTimeConfigChange}
        indexInitialSelectedTimeConfig={indexInitialSelectedTimeConfig}
      />
    </SimpleModeStepContentWrapper>
  );
}
