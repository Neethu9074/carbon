import PropTypes from 'prop-types';
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
  granularity,
  onChange,
  onClose,
  setSliderState,
  timeConfig,
  websiteLabel,
  onCreate,
  setSimpleModeStep,
  updateForm
}) {
  return (
    <SimpleModePageNavigation
      form={form}
      editMode={editMode}
      onClose={onClose}
      onCreate={onCreate}
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
                timeConfig={timeConfig}
                setJsErrorsListVisible={setSliderState}
                granularity={granularity}
              />
            );
          case 1:
            return (
              <SimpleAlertConfigDialogStep2
                form={form}
                timeConfig={timeConfig}
                updateForm={updateForm}
                websiteLabel={websiteLabel}
                granularity={granularity}
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

SimpleModeContainer.propTypes = {
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  setSliderState: PropTypes.func.isRequired,
  setSimpleModeStep: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired
};
