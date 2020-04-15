import PropTypes from 'prop-types';
import React from 'react';

import SimpleAlertConfigDialogStep3 from 'in-new-components/Alerting/simple/SimpleAlertConfigDialogStep3';
import SimpleAlertConfigDialogStep2 from 'in-applications/alerting/simple/SimpleAlertConfigDialogStep2';
import SimpleModePageNavigation from 'in-new-components/Alerting/simple/SimpleModePageNavigation';
import { applicationsAlertingStepSwitch } from 'in-applications/alerting/tracker';
import { propTypeTimeConfig } from 'in-stores/time/config';

const stepConfigs = [
  {
    title: 'Step 1: Select Alert',
    validateIntermediately: [['rule', 'message'], ['rule', 'level']]
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
  applicationLabel,
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
      onStepChanged={(oldStep, nextStep) => applicationsAlertingStepSwitch({ oldStep, nextStep })}
      renderStep={step => {
        switch (step) {
          case 0:
            return <p>TODO</p>;
          case 1:
            return (
              <SimpleAlertConfigDialogStep2
                form={form}
                timeConfig={timeConfig}
                updateForm={updateForm}
                applicationLabel={applicationLabel}
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
  timeConfig: propTypeTimeConfig.isRequired,
  applicationLabel: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired
};
