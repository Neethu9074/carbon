import React from 'react';

import SimpleAlertConfigDialogStep3 from 'in-new-components/Alerting/simple/SimpleAlertConfigDialogStep3';
import SimpleAlertConfigDialogStep1 from 'in-websites/alerting/simple/SimpleAlertConfigDialogStep1';
import SimpleAlertConfigDialogStep2 from 'in-websites/alerting/simple/SimpleAlertConfigDialogStep2';
import SimpleModePageNavigation from 'in-new-components/Alerting/simple/SimpleModePageNavigation';
import { websitesAlertingStepSwitch } from 'in-websites/alerting/tracker';

const stepConfigs = [
  {
    title: 'Step 1: Select Alert',
    validateIntermediately: [['rule', 'value']]
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
  onTimeConfigChange,
  indexInitialSelectedTimeConfig
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
                onTimeConfigChange={onTimeConfigChange}
                indexInitialSelectedTimeConfig={indexInitialSelectedTimeConfig}
              />
            );
          case 1:
            return (
              <SimpleAlertConfigDialogStep2
                form={form}
                timeConfig={timeConfig}
                updateForm={updateForm}
                websiteLabel={websiteLabel}
                onTimeConfigChange={onTimeConfigChange}
                indexInitialSelectedTimeConfig={indexInitialSelectedTimeConfig}
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
