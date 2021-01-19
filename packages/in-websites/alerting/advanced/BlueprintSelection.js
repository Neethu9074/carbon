/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { default as GlobalBlueprintSelection } from 'in-new-components/Alerting/advanced/BlueprintSelection';
import createBlueprintForm from 'in-websites/alerting/form/blueprintFormCreator';
import { websitesAlertingBlueprintChanged } from 'in-websites/alerting/tracker';

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
      trackBlueprintChange={newBlueprint => websitesAlertingBlueprintChanged({ newBlueprint, mode: 'advanced' })}
    />
  );
}
