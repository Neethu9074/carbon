/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SimpleAlertConfigDialogStep3 from 'in-new-components/Alerting/simple/SimpleAlertConfigDialogStep3';
import SimpleModePageNavigation from 'in-new-components/BlueprintFormMultistep/SimpleModePageNavigation';
import SimpleAlertConfigDialogStep2 from 'in-applications/alerting/simple/SimpleAlertConfigDialogStep2';
import SimpleAlertConfigDialogStep1 from 'in-applications/alerting/simple/SimpleAlertConfigDialogStep1';
import { applicationsAlertingStepSwitch } from 'in-applications/alerting/tracker';

const stepConfigs = [
  {
    title: 'Step 1: Select Alert',
    validateIntermediately: [
      ['rule', 'message'],
      ['rule', 'level']
    ]
  },
  {
    title: 'Step 2: Select Scope'
  },
  {
    title: 'Step 3: Select Alerting Channels',
    validateIntermediately: [['alertChannelIds']]
  }
];

export default function SimpleModeContainer({
  form,
  onChange,
  onClose,
  setSliderState,
  timeConfig,
  applicationLabel,
  onCreate,
  setSimpleModeStep,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  return (
    <SimpleModePageNavigation
      form={form}
      onClose={onClose}
      onCreate={onCreate}
      setSimpleModeStep={setSimpleModeStep}
      updateForm={updateForm}
      stepConfigs={stepConfigs}
      onStepChanged={(oldStep, nextStep) => applicationsAlertingStepSwitch({ oldStep, nextStep })}
      renderStep={step => {
        switch (step) {
          case 0:
            return (
              <SimpleAlertConfigDialogStep1
                form={form}
                updateForm={updateForm}
                setLogMessagesListVisible={setSliderState}
                onChartViewConfigChange={onChartViewConfigChange}
                selectedChartViewConfigIndex={selectedChartViewConfigIndex}
              />
            );
          case 1:
            return (
              <SimpleAlertConfigDialogStep2
                form={form}
                timeConfig={timeConfig}
                updateForm={updateForm}
                applicationLabel={applicationLabel}
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
