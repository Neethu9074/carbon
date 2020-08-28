import React from 'react';

import { default as GlobalBlueprintSelection } from 'in-new-components/Alerting/advanced/BlueprintSelection';
import { applicationsAlertingBlueprintChanged } from 'in-applications/alerting/tracker';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';

export default function BlueprintSelection(props) {
  return (
    <GlobalBlueprintSelection
      {...props}
      updateFormForSelectedBlueprint={blueprintConfig => {
        props.updateForm(
          createBlueprintForm(props.form, blueprintConfig.type, blueprintConfig.thresholdDefaults).updateIn(
            ['hiddenFields', 'calculateThresholdOnBackend'],
            f => f.setValue(true)
          )
        );
      }}
      trackBlueprintChange={newBlueprint => applicationsAlertingBlueprintChanged({ newBlueprint, mode: 'advanced' })}
    />
  );
}
