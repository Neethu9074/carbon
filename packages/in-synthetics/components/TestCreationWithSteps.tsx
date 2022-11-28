/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import React from 'react';

import StepwiseTestCreationContainer from 'in-synthetics/components/StepwiseTestCreationContainer';
import { BluePrint } from 'in-synthetics/data/simpleModeBluePrints';
import StepProgressBar from 'in-components/StepProgressBar';

import locals from './TestCreationWithSteps.mless';

export interface Props {
  onDialogClose: () => void;
  onSubmit: (form: MapForm) => void;
  isSubmitting: boolean;
  form: MapForm;
  formId: string;
  step: number;
  updateStep: (step: number) => void;
  updateForm: (form: MapForm) => void;
  stepConfigs: readonly { title: string }[];
  setScriptValidationStatus: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBlueprint: BluePrint;
  setSelectedBlueprint: (item: BluePrint) => void;
}

export default function TestCreationWithSteps({
  onSubmit,
  formId,
  form,
  step,
  updateStep,
  updateForm,
  stepConfigs,
  setScriptValidationStatus,
  selectedBlueprint,
  setSelectedBlueprint
}: Props) {
  const onProceed = () => {
    if (step !== stepConfigs.length - 1) {
      updateStep(step + 1);
      return;
    }

    onSubmit(form);
  };

  return (
    <form
      id={formId}
      onSubmit={e => {
        e.preventDefault();
        onProceed();
      }}
      className={locals.form}
    >
      <StepProgressBar stepTitles={mapTitles(stepConfigs)} step={step} />
      <StepwiseTestCreationContainer
        step={step}
        form={form}
        updateForm={updateForm}
        setScriptValidationStatus={setScriptValidationStatus}
        selectedBlueprint={selectedBlueprint}
        setSelectedBlueprint={setSelectedBlueprint}
      />
    </form>
  );
}

function mapTitles(stepConfigs: readonly { title: string }[]) {
  return stepConfigs.map(stepConfig => stepConfig.title);
}
