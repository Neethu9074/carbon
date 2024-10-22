/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Typography, Spacer } from '@instana/components';
import { Result } from '@instana/types';

import useGenerateAIScriptActionForm, {
  getActionFromForm
} from 'in-automation/AutomationCard/GenerateAIActionDialog/useGenerateAIScriptActionForm';
import { CreateActionSuccessNotification } from 'in-automation/AutomationCard/GenerateAIActionDialog/CreateActionSuccessNotification';
import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAIActionDialog/useGenerateAIScriptActionForm';
import CopyActionStepScriptAction from 'in-automation/AutomationCard/GenerateAIActionDialog/Steps/CopyActionStepScriptAction';
import { CloseDialogConfirmation } from 'in-automation/AutomationCard/GenerateAIActionDialog/CloseDialogConfirmation';
import { useGeneratedAction } from 'in-automation/AutomationCard/GenerateAIActionDialog/Steps/GenerateScriptStep';
import GenerateScriptStep from 'in-automation/AutomationCard/GenerateAIActionDialog/Steps/GenerateScriptStep';
import SelectManualStep from 'in-automation/AutomationCard/GenerateAIActionDialog/Steps/SelectManualStep';
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { StepConfigs } from 'in-components/BlueprintFormMultistep/StepConfigs';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { close, addActiveDialog } from 'in-components/DialogPresenter/store';
import { setViewTrackingDataValues } from 'in-components/ViewTrackingMeta';
import { error, hasError, isLoading } from 'in-services/util/result';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { useSegmentTracker } from 'in-automation/tracker';
import { pendingResult } from 'in-services/fixedObjects';
import { saveNewAction } from 'in-automation/api';
import { t } from 'in-i18n';

import locals from './GenerateAIScriptActionDialog.mless';

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
  close();
}
function useOnSubmit() {
  const { createActionTrackerSegment, AIActionContentModifiedTrackerSegment } = useSegmentTracker();
  const [result, setResult] = useState<Result<any> | null>(null);
  const navigateToActionCatalog = useNavigateToActionCatalog();
  // const generatedAction = useGeneratedAction();
  function onSubmit({ form }: { form: GenerateAIScriptActionForm }) {
    const liveAIGeneration = true;
    const actionContent = form.get('action').get('script').value;
    const aiGeneratedContent = form.get('action').get('aiGeneratedContent').value;
    const userChangedAIGeneratedContent = actionContent === aiGeneratedContent;

    function trackAction() {
      setViewTrackingDataValues(productAreas.events, pageNames.event_generate_with_watsonx);
      createActionTrackerSegment({
        actionName: action.name,
        actionType: action.type,
        aiOriginated: true,
        // createActionAndPolicyButtonClicked: both,
        liveAIGeneration,
        userChangedAIGeneratedContent
      });
      if (!userChangedAIGeneratedContent && liveAIGeneration) {
        const promptForm = form.get('prompt');
        const selectedManualStep = promptForm.get('selectedManualStep').value;
        const promptStep = promptForm.get('promptStep').value;
        AIActionContentModifiedTrackerSegment({
          actionContent,
          aiGeneratedContent,
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
          CreateActionSuccessNotification(result.data?.name!, result.data?.id!);
          navigateToActionCatalog();
          close();
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

export default function GenerateAIScriptActionDialog({ manualContent, actionName }: GenerateAIScriptActionDialogProps) {
  const [step, setStep] = useState(0);

  const [form, setForm] = useGenerateAIScriptActionForm();
  const { result, onSubmit } = useOnSubmit();
  // const generatedAction = useGeneratedAction();
  const onCancel = useOnCancel(step);

  const isSaving = (result && isLoading(result)) ?? false;
  const onCreate = () => {
    onSubmit({ form });
  };

  function onStepChange(oldStep: number, newStep: number) {
    if (oldStep === 1 && newStep === 0) {
      // const liveAIGeneration = generatedAction ? true : false;
      // selectNextPromptStepClickTrackerSegment({ liveAIGeneration });
      setForm(form => form.updateIn(['action', 'script'], item => item.setValue('').setTouched(true)));
      return true;
    }
    return true;
  }

  return (
    <DialogWithSlideInView
      title={
        <Typography variant="heading-400">
          {t('in-automation:GenerateAIActionDialog.generateScriptDialog.dialogHeader')}
        </Typography>
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
          onStepChanged={(oldStep, nextStep) => onStepChange(oldStep, nextStep)}
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
