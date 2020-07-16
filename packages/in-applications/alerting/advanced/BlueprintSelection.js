import React from 'react';

import { default as GlobalBlueprintSelection } from 'in-new-components/Alerting/advanced/BlueprintSelection';
import { applicationsAlertingBlueprintChanged } from 'in-applications/alerting/tracker';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';

export default function BlueprintSelection(props) {
  return (
    <GlobalBlueprintSelection
      {...props}
      updateFormForSelectedBlueprint={alertType => {
        props.updateForm(
          createBlueprintForm(props.form, alertType)
            .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
            .updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true)) // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
        );
      }}
      trackBlueprintChange={newBlueprint => applicationsAlertingBlueprintChanged({ newBlueprint, mode: 'advanced' })}
    />
  );
}
