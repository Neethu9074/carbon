/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import React from 'react';

import StepwiseTestCreationContainer from 'in-synthetics/components/StepwiseTestCreationContainer';
import { SliderState } from 'in-synthetics/components/TestConfigDialogPresenter';
import { syntheticCreateTestAdvanceModeEnabled } from 'in-services/featureFlags';
import AdvancedMode from 'in-synthetics/components/advanced/AdvancedMode';
import { BluePrint } from 'in-synthetics/data/simpleModeBluePrints';
import StepProgressBar from 'in-components/StepProgressBar';
import { Error as ScriptError } from 'in-types';

import locals from './TestCreationWithSteps.mless';

export interface Props {
  onDialogClose: () => void;
  onSubmit: (form: MapForm<any>) => void;
  isSubmitting: boolean;
  form: MapForm<any>;
  formId: string;
  step: number;
  updateStep: (step: number) => void;
  updateForm: (form: MapForm<any>) => void;
  stepConfigs: readonly { title: string }[];
  selectedBlueprint: BluePrint;
  setSelectedBlueprint: (item: BluePrint) => void;
  scriptErrors: ScriptError[];
  setScriptErrors: React.Dispatch<React.SetStateAction<ScriptError[]>>;
  simpleMode: boolean;
  setSliderState: (state: SliderState) => void;
  testTypeSelected: { simple: boolean; script: boolean };
  setTestTypeSelected: (type: { simple: boolean; script: boolean }) => void;
  renderSectionsCounter: number;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
}

export default function TestCreationWithSteps({
  onSubmit,
  formId,
  form,
  step,
  updateStep,
  updateForm,
  stepConfigs,
  selectedBlueprint,
  setSelectedBlueprint,
  scriptErrors,
  setScriptErrors,
  simpleMode,
  setSliderState,
  testTypeSelected,
  setTestTypeSelected,
  renderSectionsCounter,
  setRenderSectionsCounter
}: Props) {
  const onProceed = () => {
    if (simpleMode && step !== stepConfigs.length - 1) {
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
      {!simpleMode && syntheticCreateTestAdvanceModeEnabled ? (
        <AdvancedMode
          form={form}
          updateForm={updateForm}
          setSliderState={setSliderState}
          testTypeSelected={testTypeSelected}
          setTestTypeSelected={setTestTypeSelected}
          renderSectionsCounter={renderSectionsCounter}
          setRenderSectionsCounter={setRenderSectionsCounter}
        />
      ) : (
        <>
          <StepProgressBar stepTitles={mapTitles(stepConfigs)} step={step} />
          <StepwiseTestCreationContainer
            step={step}
            form={form}
            updateForm={updateForm}
            selectedBlueprint={selectedBlueprint}
            setSelectedBlueprint={setSelectedBlueprint}
            scriptErrors={scriptErrors}
            setScriptErrors={setScriptErrors}
            simpleMode={simpleMode}
          />
        </>
      )}
    </form>
  );
}

function mapTitles(stepConfigs: readonly { title: string }[]) {
  return stepConfigs.map(stepConfig => stepConfig.title);
}
