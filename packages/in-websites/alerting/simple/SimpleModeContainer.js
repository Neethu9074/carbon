/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import SimpleAlertConfigDialogStep3 from 'in-new-components/Alerting/simple/SimpleAlertConfigDialogStep3';
import SimpleModePageNavigation from 'in-new-components/BlueprintFormMultistep/SimpleModePageNavigation';
import SimpleAlertConfigDialogStep1 from 'in-websites/alerting/simple/SimpleAlertConfigDialogStep1';
import SimpleAlertConfigDialogStep2 from 'in-websites/alerting/simple/SimpleAlertConfigDialogStep2';
import { websitesAlertingStepSwitch } from 'in-websites/alerting/tracker';

const stepConfigs = [
  {
    title: t('in-websites:alerting.simple.stepConfigsStep1Title'),
    validateIntermediately: [['rule', 'value']]
  },
  {
    title: t('in-websites:alerting.simple.stepConfigsStep2Title')
  },
  {
    title: t('in-websites:alerting.simple.stepConfigsStep3Title'),
    validateIntermediately: [['alertChannelIds']]
  }
];

export default function SimpleModeContainer({
  editMode,
  form,
  onChange,
  onClose,
  setSliderState,
  timeConfig,
  websiteLabel,
  onCreate,
  setSimpleModeStep,
  updateForm,
  isSaving,
  QueryBuilderComponent,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  return (
    <SimpleModePageNavigation
      form={form}
      editMode={editMode}
      onClose={onClose}
      onCreate={onCreate}
      isSaving={isSaving}
      setSimpleModeStep={setSimpleModeStep}
      updateForm={updateForm}
      stepConfigs={stepConfigs}
      onStepChanged={(oldStep, nextStep) => websitesAlertingStepSwitch({ oldStep, nextStep })}
      renderStep={step => {
        switch (step) {
          case 0:
            return (
              <SimpleAlertConfigDialogStep1
                form={form}
                updateForm={updateForm}
                onChange={onChange}
                setJsErrorsListVisible={setSliderState}
                onChartViewConfigChange={onChartViewConfigChange}
                selectedChartViewConfigIndex={selectedChartViewConfigIndex}
              />
            );
          case 1:
            return (
              <SimpleAlertConfigDialogStep2
                form={form}
                QueryBuilderComponent={QueryBuilderComponent}
                timeConfig={timeConfig}
                updateForm={updateForm}
                websiteLabel={websiteLabel}
                onChartViewConfigChange={onChartViewConfigChange}
                selectedChartViewConfigIndex={selectedChartViewConfigIndex}
              />
            );
          case 2:
            return (
              <SimpleAlertConfigDialogStep3 form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
            );
        }
      }}
    />
  );
}
