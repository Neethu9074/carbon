/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Application, Error as ScriptError, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import RequestResponseStep from 'in-synthetics/createTests/wizard/RequestResponseStep';
import SelectScheduleStep from 'in-synthetics/createTests/wizard/SelectScheduleStep';
import BasicDetailsStep from 'in-synthetics/createTests/wizard/BasicDetailsStep';
import { BluePrint } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import SelectTestStep from 'in-synthetics/createTests/wizard/SelectTestStep';
import { pendingResult } from 'in-services/fixedObjects';
import { getApplicationsList } from 'in-synthetics/api';
import { Code } from 'in-synthetics/utils/constants';

import locals from 'in-synthetics/createTests/wizard/StepwiseTestCreationContainer.mless';

export interface Props {
  step: number;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  selectedBlueprint: BluePrint;
  setSelectedBlueprint: (item: BluePrint) => void;
  scriptErrors: ScriptError[];
  setScriptErrors: React.Dispatch<React.SetStateAction<ScriptError[]>>;
  simpleMode: boolean;
  scriptDetails: Code;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
}

export default function StepwiseTestCreationContainer({
  step,
  form,
  updateForm,
  selectedBlueprint,
  setSelectedBlueprint,
  scriptErrors,
  setScriptErrors,
  simpleMode,
  scriptDetails,
  setScriptDetails
}: Props) {
  const applications: Result<Application[]> = useObservable<any, []>(() => getApplicationsList(), []) ?? pendingResult;

  function renderSteps() {
    switch (step) {
      case 0:
        return (
          <SelectTestStep
            selectedBlueprint={selectedBlueprint}
            onSelectBluePrint={setSelectedBlueprint}
            updateForm={updateForm}
            setScriptErrors={setScriptErrors}
            simpleMode={simpleMode}
          />
        );
      case 1:
        return (
          <RequestResponseStep
            selectedBlueprint={selectedBlueprint}
            form={form}
            updateForm={updateForm}
            scriptErrors={scriptErrors}
            setScriptErrors={setScriptErrors}
            scriptDetails={scriptDetails}
            setScriptDetails={setScriptDetails}
          />
        );
      case 2:
        return <SelectScheduleStep form={form} updateForm={updateForm} simpleMode={simpleMode} />;
      case 3:
        return (
          <BasicDetailsStep
            selectedBlueprint={selectedBlueprint}
            form={form}
            updateForm={updateForm}
            applications={applications}
          />
        );
      default:
        return null;
    }
  }

  return <div className={locals.container}>{renderSteps()}</div>;
}
