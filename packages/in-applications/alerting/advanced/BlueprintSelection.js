import React from 'react';

import { default as GlobalBlueprintSelection } from 'in-new-components/Alerting/advanced/BlueprintSelection';
import { applicationsAlertingBlueprintChanged } from 'in-applications/alerting/tracker';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';

export default function BlueprintSelection(props) {
  return (
    <GlobalBlueprintSelection
      {...props}
      updateFormForSelectedBlueprint={blueprintConfig => {
        let updatedForm = createBlueprintForm(
          props.form,
          blueprintConfig.type,
          blueprintConfig.thresholdDefaults
        ).updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true));

        const thresholdType = updatedForm.get('threshold').get('type').value;
        // reset "old" threshold/baseline-value to ensure that we don't call endpoints with the previous values
        if (thresholdType === 'historicBaseline') {
          updatedForm = updatedForm.updateIn(['threshold', 'baseline'], f => f.setValue(null).setTouched(true));
        } else {
          updatedForm = updatedForm.updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true));
        }

        props.updateForm(updatedForm);
      }}
      trackBlueprintChange={newBlueprint => applicationsAlertingBlueprintChanged({ newBlueprint, mode: 'advanced' })}
    />
  );
}
