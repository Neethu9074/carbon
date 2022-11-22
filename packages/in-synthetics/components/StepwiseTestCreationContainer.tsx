/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import RequestResponseStep from 'in-synthetics/components/steps/RequestResponseStep';
import SelectScheduleStep from 'in-synthetics/components/steps/SelectScheduleStep';
import BasicDetailsStep from 'in-synthetics/components/steps/BasicDetailsStep';
import SelectTestStep from 'in-synthetics/components/steps/SelectTestStep';
import { blueprintConfig } from 'in-synthetics/data/simpleModeBluePrints';

import locals from './StepwiseTestCreationContainer.mless';

export interface Props {
  step: number;
  form: MapForm;
  updateForm: (form: MapForm) => void;
  setScriptValidationStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function StepwiseTestCreationContainer({ step, form, updateForm, setScriptValidationStatus }: Props) {
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprintConfig[0]);

  function renderSteps() {
    switch (step) {
      case 0:
        return (
          <SelectTestStep
            selectedBlueprint={selectedBlueprint}
            onSelectBluePrint={setSelectedBlueprint}
            updateForm={updateForm}
          />
        );
      case 1:
        return (
          <RequestResponseStep
            selectedBlueprint={selectedBlueprint}
            form={form}
            updateForm={updateForm}
            setScriptValidationStatus={setScriptValidationStatus}
          />
        );
      case 2:
        return <SelectScheduleStep form={form} updateForm={updateForm} />;
      case 3:
        return <BasicDetailsStep form={form} updateForm={updateForm} />;
      default:
        return null;
    }
  }

  return <div className={locals.container}>{renderSteps()}</div>;
}
