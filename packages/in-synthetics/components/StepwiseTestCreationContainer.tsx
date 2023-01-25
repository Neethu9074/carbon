/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Progress } from '@instana/types';

import RequestResponseStep from 'in-synthetics/components/steps/RequestResponseStep';
import SelectScheduleStep from 'in-synthetics/components/steps/SelectScheduleStep';
import BasicDetailsStep from 'in-synthetics/components/steps/BasicDetailsStep';
import SelectTestStep from 'in-synthetics/components/steps/SelectTestStep';
import { BluePrint } from 'in-synthetics/data/simpleModeBluePrints';
import { dummyApplications } from 'in-synthetics/utils/constants';
import { getApplicationsList } from 'in-synthetics/api';

import locals from './StepwiseTestCreationContainer.mless';

export interface Props {
  step: number;
  form: MapForm;
  updateForm: (form: MapForm) => void;
  setEnableNextButton: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBlueprint: BluePrint;
  setSelectedBlueprint: (item: BluePrint) => void;
  setScriptErrorExists: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ApplicationsResponse {
  data?: Record<string, any>[];
  errors?: Error[];
  progress: Progress;
  time?: number;
}

export default function StepwiseTestCreationContainer({
  step,
  form,
  updateForm,
  setEnableNextButton,
  selectedBlueprint,
  setSelectedBlueprint,
  setScriptErrorExists
}: Props) {
  const applications: ApplicationsResponse =
    useObservable<any, []>(() => getApplicationsList(), []) || dummyApplications;

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
            setEnableNextButton={setEnableNextButton}
            setScriptErrorExists={setScriptErrorExists}
          />
        );
      case 2:
        return <SelectScheduleStep form={form} updateForm={updateForm} />;
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
