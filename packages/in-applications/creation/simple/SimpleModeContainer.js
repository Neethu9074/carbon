import React, { useState } from 'react';

import SimpleModePageNavigation from 'in-new-components/BlueprintFormMultistep/SimpleModePageNavigation';
import SimpleCreateStep1 from 'in-applications/creation/simple/SimpleCreateStep1';
import SimpleCreateStep2 from 'in-applications/creation/simple/SimpleCreateStep2';
import SimpleCreateStep3 from 'in-applications/creation/simple/SimpleCreateStep3';
import { applicationCreationStepSwitch } from 'in-applications/creation/tracker';
import { blueprintConfig } from 'in-applications/creation/data/blueprintConfig';

const stepConfigs = [
  {
    title: 'Step 1: Define Application'
  },
  {
    title: 'Step 2: Build your Application'
  },
  {
    title: 'Step 3: Configuration Options'
  }
];

export default function SimpleModeContainer({ onClose, setSimpleModeStep, timeConfig, form, updateForm, onCreate }) {
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprintConfig[0]);

  return (
    <SimpleModePageNavigation
      form={form}
      updateForm={updateForm}
      onClose={onClose}
      setSimpleModeStep={setSimpleModeStep}
      stepConfigs={stepConfigs}
      onCreate={onCreate}
      onStepChanged={(oldStep, nextStep) => applicationCreationStepSwitch({ oldStep, nextStep })}
      renderStep={step => {
        switch (step) {
          case 0:
            return (
              <SimpleCreateStep1 selectedBlueprint={selectedBlueprint} setSelectedBlueprint={setSelectedBlueprint} />
            );
          case 1:
            return (
              <SimpleCreateStep2
                selectedBlueprint={selectedBlueprint}
                timeConfig={timeConfig}
                form={form}
                updateForm={updateForm}
              />
            );
          case 2:
            return <SimpleCreateStep3 selectedBlueprint={selectedBlueprint} form={form} updateForm={updateForm} />;
        }
      }}
    />
  );
}
