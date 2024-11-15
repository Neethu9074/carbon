/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Typography, Spacer, PreviewPill } from '@instana/components';
import { Result } from '@instana/types';

import useGenerateAIScriptActionForm, {
  getActionFromForm
} from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import {
  setGeneratedAction,
  useGeneratedAction
} from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/GenerateScriptStep';
import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import CopyActionStepScriptAction from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/CopyActionStepScriptAction';
import { createActionSuccessNotification } from 'in-automation/AutomationCard/GenerateAI/CreateActionSuccessNotification';
import GenerateScriptStep from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/GenerateScriptStep';
import SelectManualStep from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/SelectManualStep';
import { CloseDialogConfirmation } from 'in-automation/AutomationCard/GenerateAI/CloseDialogConfirmation';
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { StepConfigs } from 'in-components/BlueprintFormMultistep/StepConfigs';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { close, addActiveDialog } from 'in-components/DialogPresenter/store';
import { useSegmentTracker, TrackingFunction } from 'in-automation/tracker';
import { setViewTrackingDataValues } from 'in-components/ViewTrackingMeta';
import { error, hasError, isLoading } from 'in-services/util/result';
import { productAreas } from 'in-services/tracking/productAreas';
import { refresh } from 'in-automation/ActionCatalog/useActions';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import { saveNewAction } from 'in-automation/api';
import { t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/GenerateAIScriptActionDialog.mless';

const stepConfigs: StepConfigs = [
  {
    title: t('in-automation:GenerateAIActionDialog.generateScriptDialog.step1Title')
  },
  {
    title: t('in-automation:GenerateAIActionDialog.generateScriptDialog.step2Title')
  },
  {
    title: t('in-automation:GenerateAIActionDialog.generateScriptDialog.step3Title')
  }
];

interface GenerateAIScriptActionDialogProps {
  manualContent: string;
  actionName: string;
}

function additionalStepCheck(step: number, form: GenerateAIScriptActionForm) {
  if (step === 0) {
    return form.get('prompt').get('selectedManualStep').valid;
  }
  if (step === 1) {
    return form.get('action').get('script').valid;
  }
  return true;
}

function onClose() {
  setGeneratedAction(null);
  close();
}
function useOnSubmit() {
  const { createActionTrackerSegment, AIActionContentModifiedTrackerSegment } = useSegmentTracker();
  const [result, setResult] = useState<Result<any> | null>(null);
  const navigateToActionCatalog = useNavigateToActionCatalog();
  function onSubmit({ form }: { form: GenerateAIScriptActionForm }) {
    const actionScript = form.get('action').get('script').value;
    const aiGeneratedScript = form.get('action').get('aiGeneratedContent').value;
    const userChangedAIGeneratedContent = actionScript === aiGeneratedScript;

    function trackAction() {
      setViewTrackingDataValues(productAreas.events, pageNames.event_generate_with_watsonx);
      createActionTrackerSegment({
        actionName: action.name,
        actionType: action.type,
        aiOriginated: true,
        liveAIGeneration: true,
        userChangedAIGeneratedContent
      });
      if (!userChangedAIGeneratedContent) {
        const promptForm = form.get('prompt');
        const selectedManualStep = promptForm.get('selectedManualStep').value;
        const promptStep = promptForm.get('promptStep').value;
        AIActionContentModifiedTrackerSegment({
          actionScript,
          aiGeneratedScript,
          prompt: {
            selectedManualStep,
            promptStep
          }
        });
      }
    }
    const action = getActionFromForm(form);
    setResult(pendingResult);
    saveNewAction(action)
      .filter(res => !isLoading(res))
      .once(
        result => {
          setResult(result);
          if (hasError(result)) return;
          trackAction();
          createActionSuccessNotification(result.data?.name!, result.data?.id!);
          navigateToActionCatalog();
          refresh();
          onClose();
        },
        () => {
          const err = error([
            { code: 'SERVER', message: t('in-automation:GenerateAIActionDialog.failedToCreateAction') }
          ]);
          setResult(err);
        }
      );
  }
  return {
    onSubmit,
    result
  };
}

function useOnCancel(step: number) {
  const generatedAction = useGeneratedAction();

  return () => {
    if (generatedAction) {
      return addActiveDialog(
        <CloseDialogConfirmation
          step={step}
          dialogHeader={t('in-automation:GenerateAIActionDialog.generateScriptDialog.dialogHeader')}
          onClose={onClose}
        />
      );
    } else {
      close();
    }
  };
}

function onStepChange(
  oldStep: number,
  newStep: number,
  aiActionScriptSelectStepNextTrackerSegment: TrackingFunction,
  form: GenerateAIScriptActionForm,
  aiActionScriptGenerateStepNextClickTrackerSegment: TrackingFunction
) {
  if (oldStep === 0 && newStep === 1) {
    const promptForm = form.get('prompt');
    const selectedManualStep = promptForm.get('selectedManualStep').value;
    aiActionScriptSelectStepNextTrackerSegment({ selectedManualStep: selectedManualStep });
    return true;
  }

  if (oldStep === 1 && newStep === 2) {
    const promptForm = form.get('prompt');
    const selectedManualStep = promptForm.get('selectedManualStep').value;
    const promptStep = promptForm.get('promptStep').value;
    aiActionScriptGenerateStepNextClickTrackerSegment({ selectedManualStep: selectedManualStep, prompt: promptStep });
    return true;
  }
  return true;
}

export default function GenerateAIScriptActionDialog({ manualContent, actionName }: GenerateAIScriptActionDialogProps) {
  const [step, setStep] = useState(0);

  const [form, setForm] = useGenerateAIScriptActionForm();
  const { result, onSubmit } = useOnSubmit();
  const onCancel = useOnCancel(step);
  const { aiActionScriptSelectStepNextTrackerSegment, aiActionScriptGenerateStepNextClickTrackerSegment } =
    useSegmentTracker();

  const isSaving = (result && isLoading(result)) ?? false;
  const onCreate = () => {
    onSubmit({ form });
  };

  return (
    <DialogWithSlideInView
      title={
        <>
          <Typography variant="heading-400">
            {t('in-automation:GenerateAIActionDialog.generateScriptDialog.dialogHeader')}
          </Typography>
          <Spacer horizontal="small" />
          <PreviewPill />
        </>
      }
      onClose={onCancel}
      doNotCloseOnOutsideClick
    >
      <LeftRightPadding className={locals.dialog}>
        <SimpleModePageNavigation
          form={form}
          formId="generateScriptForm"
          onCreate={onCreate}
          updateForm={setForm}
          isSaving={isSaving}
          onClose={onCancel}
          onStepChanged={(oldStep, nextStep) =>
            onStepChange(
              oldStep,
              nextStep,
              aiActionScriptSelectStepNextTrackerSegment,
              form,
              aiActionScriptGenerateStepNextClickTrackerSegment
            )
          }
          simpleModeStep={step}
          setSimpleModeStep={setStep}
          renderStep={step => {
            switch (step) {
              case 0:
                return (
                  <SelectManualStep
                    actionName={actionName}
                    manualContent={manualContent}
                    form={form}
                    setForm={setForm}
                  />
                );
              case 1:
                return <GenerateScriptStep form={form} setForm={setForm} />;
              case 2:
                return <CopyActionStepScriptAction form={form} setForm={setForm} result={result} />;
              default:
                return null;
            }
          }}
          additionalStepCheck={step => additionalStepCheck(step, form)}
          stepConfigs={stepConfigs}
          noStepCheckOnFirstStep
        />
      </LeftRightPadding>
      <Spacer vertical="large" />
    </DialogWithSlideInView>
  );
}
