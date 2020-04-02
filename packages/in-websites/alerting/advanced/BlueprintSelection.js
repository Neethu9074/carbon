import React from 'react';

import { default as GlobalBlueprintSelection } from 'in-new-components/Alerting/advanced/BlueprintSelection';
import createBlueprintForm from 'in-websites/alerting/form/blueprintFormCreator';
import { websitesAlertingBlueprintChanged } from 'in-websites/alerting/tracker';

export default function BlueprintSelection(props) {
  return (
    <GlobalBlueprintSelection
      {...props}
      updateFormForSelectedBlueprint={alertType => {
        props.updateForm(
          createBlueprintForm(props.form, alertType).updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f =>
            f.setValue(true)
          )
        );
      }}
      trackBlueprintChange={newBlueprint => websitesAlertingBlueprintChanged({ newBlueprint, mode: 'advanced' })}
    />
  );
}
