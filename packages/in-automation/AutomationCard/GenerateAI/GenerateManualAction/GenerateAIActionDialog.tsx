/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Link, Spacer, Typography } from '@instana/components';
import { Action, Event, Policy, Result } from '@instana/types';
import { just } from '@instana/observables';

import useGenerateAIActionForm, {
  GenerateAIActionForm,
  getActionFromForm
} from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/useGenerateAIActionForm';
import {
  setGeneratedAction,
  useGeneratedAction
} from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/Steps/PromptStep';
import { createActionSuccessNotification } from 'in-automation/AutomationCard/GenerateAI/CreateActionSuccessNotification';
import { setSelectedAction } from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/Steps/SelectActionStep';
import CreatePolicyStep from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/Steps/CreatePolicyStep';
import ReviewActionStep from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/Steps/ReviewActionStep';
import CopyActionStep from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/Steps/CopyActionStep';
import { CloseDialogConfirmation } from 'in-automation/AutomationCard/GenerateAI/CloseDialogConfirmation';
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import { refresh as refreshScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import useHrefToPolicyDetails from 'in-automation/navigation/hooks/useHrefToPolicyDetails';
import { getActionNameExists, saveNewAction, saveNewPolicy } from 'in-automation/api';
import { setActiveKey } from 'in-automation/AutomationCard/AutomationCardButtonGroup';
import { refresh as refreshPolicies } from 'in-automation/AutomationCard/usePolicies';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { AIActionContent } from 'in-automation/subscriptions/generateAIAction';
import { StepConfigs } from 'in-components/BlueprintFormMultistep/StepConfigs';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracker, TrackingFunction } from 'in-automation/tracker';
import { ScoredAction, TriggerSpecification } from 'in-automation/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createBasePolicy } from 'in-automation/AutomationCard/shared';
import { error, hasError, isLoading } from 'in-services/util/result';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import AISlugIcon from 'in-automation/components/AISlugIcon';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/GenerateAIActionDialog.mless';

const formId = 'createPolicyAIForm';

function getStepConfigs(hasOotbActions: boolean) {
  const actionSteps: StepConfigs = [
    {
      title: hasOotbActions
        ? t('in-automation:GenerateAIActionDialog.step1Title')
        : t('in-automation:GenerateAIActionDialog.step1TitleGenerateAction')
    },
    {
      title: t('in-automation:GenerateAIActionDialog.step2Title')
    }
  ];

  const policyStep: StepConfigs = role?.canConfigureAutomationPolicies
    ? [
        {
          title: t('in-automation:GenerateAIActionDialog.step3Title')
        }
      ]
    : [];

  return [...actionSteps, ...policyStep];
}

function additionalStepCheck(step: number, form: GenerateAIActionForm) {
  if (step === 0) {
    return form.get('action').valid;
  }
  if (step === 1) {
    return form.get('action').hierarchyValid && form.get('action').valid;
  }
  return true;
}

function onStepChange(
  oldStep: number,
  newStep: number,
  selectNextPromptStepClickTrackerSegment: TrackingFunction,
  generatedAction?: Result<AIActionContent> | null
) {
  if (oldStep === 0 && newStep === 1) {
    const liveAIGeneration = generatedAction ? true : false;
    selectNextPromptStepClickTrackerSegment({ liveAIGeneration });
    return true;
  }
  return true;
}

function useOnSubmit() {
  const { createActionTrackerSegment, createPolicyTrackerSegment, AIActionContentModifiedTrackerSegment } =
    useSegmentTracker();
  const [result, setResult] = useState<Result<any> | null>(null);
  const generatedAction = useGeneratedAction();
  function onSubmit({
    both,
    form,
    setForm,
    event
  }: {
    both: boolean;
    form: GenerateAIActionForm;
    setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
    event: Event;
  }) {
    const liveAIGeneration = generatedAction ? true : false;
    const actionContent = form.get('action').get('content').value;
    const aiGeneratedContent = form.get('action').get('aiGeneratedContent').value;
    const userChangedAIGeneratedContent = actionContent !== aiGeneratedContent;

    function trackAction() {
      createActionTrackerSegment({
        actionName: action.name,
        actionType: action.type,
        aiOriginated: true,
        createActionAndPolicyButtonClicked: both,
        liveAIGeneration,
        userChangedAIGeneratedContent
      });
      if (userChangedAIGeneratedContent && liveAIGeneration) {
        const promptForm = form.get('prompt');
        const eventName = promptForm.get('eventName').value;
        const eventDescription = promptForm.get('eventDescription').value;
        const eventEntityType = promptForm.get('eventEntityType').value;
        AIActionContentModifiedTrackerSegment({
          actionContent,
          aiGeneratedContent,
          prompt: {
            eventName,
            eventDescription,
            eventEntityType
          }
        });
      }
    }
    const action = getActionFromForm(form);
    if (!both) {
      setResult(pendingResult);
      saveNewAction(action)
        .filter(res => !isLoading(res))
        .once(
          result => {
            setResult(result);
            if (hasError(result)) return;
            trackAction();
            createActionSuccessNotification(result.data?.name!, result.data?.id!);
            refreshScoredActions();
            onClose();
          },
          () => {
            const err = error([
              { code: 'SERVER', message: t('in-automation:GenerateAIActionDialog.failedToCreateAction') }
            ]);
            setResult(err);
          }
        );
    } else {
      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }
      setResult(pendingResult);
      saveNewAction(action)
        .filter(res => !isLoading(res))
        .flatMap<Result<Action | Policy>>(result => {
          setResult(result);
          if (hasError(result)) return just(result);
          createActionSuccessNotification(result.data?.name!, result.data?.id!);
          trackAction();
          const policyForm = form.get('policy');
          const policy = createBasePolicy(event, result.data!, {
            name: policyForm.get('name').value,
            description: policyForm.get('description').value,
            tags: policyForm.get('tags').value
          });
          return saveNewPolicy(policy);
        })
        .filter(res => !isLoading(res))
        .once(
          result => {
            setResult(result);
            if (hasError(result)) return;
            createPolicyTrackerSegment({
              actionName: action.name,
              actionType: action.type,
              policyName: result.data?.name,
              policyType: 'manual',
              aiOriginated: true,
              triggerName: event.problem?.problemText
            });
            setActiveKey('automationPolicies');
            onCreatePolicySuccess(result.data?.name!, result.data?.id!);
            refreshPolicies();
            onClose();
          },
          () => {
            const err = error([
              { code: 'SERVER', message: t('in-automation:GenerateAIActionDialog.failedToCreateActionPolicy') }
            ]);
            setResult(err);
          }
        );
    }
  }
  return {
    onSubmit,
    result
  };
}

function useActionNameExists({
  setStep,
  form,
  setForm
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  form: GenerateAIActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
}) {
  const [actionNameExists, setActionNameExists] = useState<boolean | null>(null);
  const { selectNextCustomizeActionStepClickTrackerSegment } = useSegmentTracker();
  return {
    checkActionNameExists: () => {
      if (!form.get('action').hierarchyValid || !form.get('action').valid) {
        setForm(form.updateIn(['action'], form => form.setTouched(true, { recurse: true })));
        return;
      }
      const actionForm = form.get('action');
      const name = actionForm.get('name').value;
      const type = actionForm.get('type').value;
      getActionNameExists(name, type)
        .filter(res => !isLoading(res))
        .once(res => {
          if (!hasError(res)) {
            const exists = res.data?.exists!;
            setActionNameExists(exists);
            if (!exists) setStep(2);
          } else {
            selectNextCustomizeActionStepClickTrackerSegment({ actionName: name, actionType: type });
            setActionNameExists(false);
            setStep(2);
          }
        });
    },
    clearActionNameExists: () => setActionNameExists(null),
    actionNameExists
  };
}

function onClose() {
  setGeneratedAction(null);
  setSelectedAction(null);
  close();
}

function useOnCancel(step: number) {
  const generatedAction = useGeneratedAction();

  return () => {
    if (generatedAction) {
      return addActiveDialog(
        <CloseDialogConfirmation step={step} onClose={onClose} dialogHeader={t('in-automation:generateWithWatsonx')} />
      );
    } else {
      onClose();
    }
  };
}

function renderCustomSaveAction({
  step,
  form,
  isSaving,
  checkActionNameExists,
  submit
}: {
  step: number;
  form: GenerateAIActionForm;
  isSaving: boolean;
  checkActionNameExists: () => void;
  submit: (both: boolean) => void;
}) {
  switch (step) {
    case 1:
      if (role?.canConfigureAutomationPolicies) {
        return () => (
          <SaveButton
            type="button"
            kind="primary"
            form={form}
            formId={formId}
            isSaving={isSaving}
            onClick={checkActionNameExists}
          >
            {t('in-automation:GenerateAIActionDialog.next')}
          </SaveButton>
        );
      } else {
        return () => (
          <SaveButton
            type="submit"
            kind="primary"
            form={form.get('action')}
            formId={formId}
            isSaving={isSaving}
            onClick={() => submit(false)}
          >
            {t('in-automation:GenerateAIActionDialog.createAction')}
          </SaveButton>
        );
      }
    case 2:
      return () => (
        <>
          <SaveButton
            type="submit"
            kind="secondary"
            form={form.get('action')}
            formId={formId}
            isSaving={isSaving}
            onClick={() => submit(false)}
          >
            {t('in-automation:GenerateAIActionDialog.createAction')}
          </SaveButton>
          <SaveButton
            type="submit"
            kind="primary"
            form={form}
            formId={formId}
            isSaving={isSaving}
            onClick={() => submit(true)}
          >
            {t('in-automation:GenerateAIActionDialog.createActionAndPolicy')}
          </SaveButton>
        </>
      );
    default:
      return undefined;
  }
}

function PolicySuccess({ name, id }: { name: string; id: string }) {
  const hrefToPolicyDetails = useHrefToPolicyDetails();

  return (
    <Trans
      i18nKey={'in-automation:GenerateAIActionDialog.policy.success.content'}
      values={{
        name
      }}
      components={{
        // @ts-expect-error
        Link: <Link external href={hrefToPolicyDetails(id)} />
      }}
    />
  );
}

function onCreatePolicySuccess(name: string, id: string) {
  addMessage({
    type: 'info',
    timeout: 5000,
    title: t('in-automation:GenerateAIActionDialog.policy.success.title'),
    content: <PolicySuccess name={name} id={id} />
  });
}

interface GenerateAIActionDialogProps {
  event: Event;
  trigger: Result<TriggerSpecification>;
  ootbRecommendedActions: Result<ScoredAction[]>;
  selectedDescription?: string | null;
  selectedEntityType?: string | null;
}

export default function GenerateAIActionDialog({
  event,
  trigger,
  ootbRecommendedActions,
  selectedDescription,
  selectedEntityType
}: GenerateAIActionDialogProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useGenerateAIActionForm({ trigger, event, selectedDescription, selectedEntityType });
  const onCancel = useOnCancel(step);
  const generatedAction = useGeneratedAction();
  const { selectNextPromptStepClickTrackerSegment } = useSegmentTracker();
  const { result, onSubmit } = useOnSubmit();
  const { actionNameExists, checkActionNameExists, clearActionNameExists } = useActionNameExists({
    form,
    setForm,
    setStep
  });

  const isSaving = (result && isLoading(result)) ?? false;
  const hasOotbActions = (ootbRecommendedActions.data?.length ?? 0) > 0;

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.events,
          pageRootName: pageNames.event_generate_with_watsonx
        }}
      />
      <DialogWithSlideInView
        title={
          <>
            <Typography variant="heading-400">{t('in-automation:generateWithWatsonx')}</Typography>
            <Spacer horizontal="small" />
            <AISlugIcon actionType="manual" />
          </>
        }
        onClose={onCancel}
        doNotCloseOnOutsideClick
      >
        <LeftRightPadding className={locals.dialog}>
          <SimpleModePageNavigation
            renderCustomSaveAction={renderCustomSaveAction({
              step,
              form,
              isSaving,
              checkActionNameExists,
              submit: both => onSubmit({ both, form, setForm, event })
            })}
            form={form}
            onStepChanged={(oldStep, nextStep) =>
              onStepChange(oldStep, nextStep, selectNextPromptStepClickTrackerSegment, generatedAction)
            }
            formId={formId}
            onClose={onCancel}
            updateForm={setForm}
            simpleModeStep={step}
            setSimpleModeStep={setStep}
            isSaving={isSaving}
            renderStep={step => {
              switch (step) {
                case 0:
                  return (
                    <ReviewActionStep form={form} setForm={setForm} actions={ootbRecommendedActions} event={event} />
                  );
                case 1:
                  return (
                    <CopyActionStep
                      clearActionNameExists={clearActionNameExists}
                      result={result}
                      actionNameExists={actionNameExists}
                      form={form}
                      setForm={setForm}
                    />
                  );
                case 2:
                  return (
                    <CreatePolicyStep
                      result={result}
                      form={form}
                      setForm={setForm}
                      action={getActionFromForm(form)}
                      trigger={trigger}
                    />
                  );
                default:
                  return null;
              }
            }}
            stepConfigs={getStepConfigs(hasOotbActions)}
            additionalStepCheck={step => additionalStepCheck(step, form)}
            noStepCheckOnFirstStep
          />
        </LeftRightPadding>
        <Spacer vertical="large" />
      </DialogWithSlideInView>
    </>
  );
}
