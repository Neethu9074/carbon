/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { notBlankValidator, ValidationMessage } from 'formalistic';

import { CreateTearsheet, CreateTearsheetStep } from '@instana/ibm-products';
import { Typography, PreviewPill, Link } from '@instana/components';
import { Result } from '@instana/types';

import useGenerateAIScriptActionForm, {
  getActionFromForm
} from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import {
  setGeneratedAction,
  useGeneratedAction
} from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/GenerateScriptStep';
import { useValidateCopyActionStep } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/hooks/useValidateCopyActionStep';
import { useValidateSelectManual } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/hooks/useValidateSelectManual';
import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import CopyActionStepScriptAction from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/CopyActionStepScriptAction';
import { useGenerateScript } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/hooks/useValidateGenerateScript';
import { createActionSuccessNotification } from 'in-automation/AutomationCard/GenerateAI/CreateActionSuccessNotification';
import GenerateScriptStep from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/GenerateScriptStep';
import SelectManualStep from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/SelectManualStep';
import { CloseDialogConfirmation } from 'in-automation/AutomationCard/GenerateAI/CloseDialogConfirmation';
import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import useOnExport from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useOnExport';
import { refresh as refreshScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import { useSegmentTracker, TrackingFunction } from 'in-automation/tracker';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { error, hasError, isLoading } from 'in-services/util/result';
import { productAreas } from 'in-services/tracking/productAreas';
import { refresh } from 'in-automation/ActionCatalog/useActions';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import AISlugIcon from 'in-automation/components/AISlugIcon';
import { pageNames } from 'in-services/tracking/pageNames';
import { areFieldsValid } from 'in-automation/utils/form';
import { pendingResult } from 'in-services/fixedObjects';
import { saveNewAction } from 'in-automation/api';
import { t, Trans } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/GenerateAIScriptActionDialog.mless';

const STEP_SELECT_MANUAL = 0;
const STEP_GENERATE_SCRIPT = 1;
const STEP_COPY_ACTION = 2;

export interface GenerateAIScriptActionDialogProps {
  manualContent?: string;
  actionName?: string;
  open?: boolean;
  closeHandler?: () => void;
  forRecommededAction?: boolean;
  eventName?: string;
}

function onClose(closeHandler: () => void): void {
  setGeneratedAction(null);
  closeHandler();
}

function useOnSubmit(
  setIsValid: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void },
  closeHandler: (() => void) | undefined,
  forRecommededAction: boolean
) {
  const { createActionTrackerSegment, AIActionContentModifiedTrackerSegment } = useSegmentTracker();
  const [result, setResult] = useState<Result<any> | null>(null);
  const navigateToActionCatalog = useNavigateToActionCatalog();

  const onSubmit = useCallback(
    // @ts-expect-error
    ({ form, resolve, reject }: { form: GenerateAIScriptActionForm }) => {
      const actionScript = form.get('action').get('script').value;
      const aiGeneratedScript = form.get('action').get('aiGeneratedContent').value;
      const userChangedAIGeneratedContent = actionScript !== aiGeneratedScript;

      const trackAction = () => {
        const action = getActionFromForm(form);
        createActionTrackerSegment({
          actionName: action.name,
          actionType: action.type,
          aiOriginated: true,
          liveAIGeneration: true,
          userChangedAIGeneratedContent
        });

        if (userChangedAIGeneratedContent) {
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
      };

      const action = getActionFromForm(form);
      setResult(pendingResult);
      saveNewAction(action)
        .filter(res => !isLoading(res))
        .once(
          result => {
            setResult(result);
            if (hasError(result)) {
              setIsValid(false);
              reject();
              return;
            }
            trackAction();
            createActionSuccessNotification(result.data?.name!, result.data?.id!);
            if (forRecommededAction) {
              refreshScoredActions();
            } else {
              navigateToActionCatalog();
              refresh();
              resolve();
            }
            closeHandler?.();
          },
          () => {
            const err = error([
              { code: 'SERVER', message: t('in-automation:GenerateAIActionDialog.failedToCreateAction') }
            ]);
            reject();
            setIsValid(false);
            setResult(err);
          }
        );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createActionTrackerSegment, AIActionContentModifiedTrackerSegment, navigateToActionCatalog, closeHandler]
  );

  return {
    onSubmit,
    result
  };
}

function useOnCancel(step: number, closeHandler: () => void) {
  const generatedAction = useGeneratedAction();
  return useCallback(() => {
    if (generatedAction) {
      return addActiveDialog(
        <div className={locals['configure-override-close-dialog']}>
          <CloseDialogConfirmation
            step={step}
            dialogHeader={t('in-automation:GenerateAIActionDialog.generateScriptDialog.dialogHeader')}
            onClose={() => {
              onClose(closeHandler);
            }}
          />
        </div>
      );
    } else {
      closeHandler();
    }
  }, [generatedAction, step, closeHandler]);
}

function handleStepChange(
  oldStep: number,
  newStep: number,
  trackers: {
    aiActionScriptSelectStepNextTrackerSegment: TrackingFunction;
    aiActionScriptGenerateStepNextClickTrackerSegment: TrackingFunction;
  },
  form: GenerateAIScriptActionForm
): boolean {
  const promptForm = form.get('prompt');
  const selectedManualStep = promptForm.get('selectedManualStep').value;

  if (oldStep === STEP_SELECT_MANUAL && newStep === STEP_GENERATE_SCRIPT) {
    trackers.aiActionScriptSelectStepNextTrackerSegment({ selectedManualStep });
    return true;
  }

  if (oldStep === STEP_GENERATE_SCRIPT && newStep === STEP_COPY_ACTION) {
    const promptStep = promptForm.get('promptStep').value;
    trackers.aiActionScriptGenerateStepNextClickTrackerSegment({
      selectedManualStep,
      prompt: promptStep
    });
    return true;
  }

  return true;
}

function getSubmitButtonText(form: GenerateAIScriptActionForm): string | null {
  const exportForm = form.get('export');
  const exportType = exportForm.get('exportType').value;

  if (exportType === 'internal') {
    return t('in-automation:GenerateAIActionDialog.createAction');
  }
  if (exportType === 'github' || exportType === 'gitlab') {
    return t('in-automation:GenerateAIActionDialog.exportToGit.export');
  }

  return '';
}

function prepareExportData(form: GenerateAIScriptActionForm) {
  const exportForm = form.get('export');
  const exportType = exportForm.get('exportType').value;
  const agent = exportForm.get('agent');
  const repository = exportForm.get('repository');
  const branch = exportForm.get('branch');
  const content = exportForm.get('content');
  const message = exportForm.get('message');
  const base = exportForm.get('base');
  const filePath = exportForm.get('file_path');

  if (!agent.value || !branch.value || exportType === 'internal') return null;

  const parameters = [
    {
      name: exportType === 'github' ? 'repository' : 'projectId',
      value: repository.value
    },
    {
      name: 'branch',
      value: branch.value.value
    },
    {
      name: 'file_path',
      value: filePath.value
    },
    ...(base.value !== '' && base.value !== null ? [{ name: 'base', value: base.value }] : []),
    {
      name: 'content',
      value: content.value
    },
    {
      name: 'message',
      value: message.value
    }
  ];

  return {
    hostId: agent.value,
    type: exportType,
    operation: 'upload_content',
    parameters
  };
}

function isExportFormValid(form: GenerateAIScriptActionForm): boolean {
  const exportForm = form.get('export');
  const exportType = exportForm.get('exportType').value;
  const agent = exportForm.get('agent');
  const repository = exportForm.get('repository');
  const branch = exportForm.get('branch');
  const content = exportForm.get('content');
  const message = exportForm.get('message');
  const filePath = exportForm.get('file_path');

  if (exportType === 'internal') return true;
  if (!agent.value || !branch.value) return false;

  const allErrors: ValidationMessage[] = [
    ...(notBlankValidator(exportType) || []),
    ...(notBlankValidator(agent.value) || []),
    ...(notBlankValidator(repository.value) || []),
    ...(notBlankValidator(branch.value?.value) || []),
    ...(notBlankValidator(message.value) || []),
    ...(notBlankValidator(content.value) || []),
    ...(notBlankValidator(filePath.value) || [])
  ];

  return allErrors.length === 0;
}

function isSelectManualFieldsInvalid(form: GenerateAIScriptActionForm): boolean {
  return !areFieldsValid(form, [['prompt', 'selectedManualStep']]);
}

function isGenerateScriptFieldsInvalid(form: GenerateAIScriptActionForm): boolean {
  return !areFieldsValid(form, [
    ['prompt', 'interpreterType'],
    ['prompt', 'promptStep'],
    ['action', 'aiGeneratedContent']
  ]);
}

export default function GenerateAIScriptActionDialog({
  manualContent,
  actionName,
  open,
  closeHandler,
  forRecommededAction = false,
  eventName
}: GenerateAIScriptActionDialogProps) {
  const [isValid, setIsValid] = useState(true);
  const [step, setStep] = useState(STEP_SELECT_MANUAL);
  const [resultUrl, setResultUrl] = useState<Result<any> | null>(null);
  const [form, setForm, resetForm] = useGenerateAIScriptActionForm();
  const { result, onSubmit } = useOnSubmit(setIsValid, closeHandler, !forRecommededAction);
  const [selectManualMount, setSelectManualMount] = useState(false);
  const [generateScriptMount, setGenerateScriptMount] = useState(false);
  const [copyActionMount, setCopyActionMount] = useState(false);

  const {
    aiActionScriptGenerateStepNextClickTrackerSegment,
    aiActionScriptSelectStepNextTrackerSegment,
    exportScriptToExternalSource
  } = useSegmentTracker();
  const { onExport } = useOnExport(!forRecommededAction);

  const onCancel = useOnCancel(step, closeHandler!);

  useEffect(() => {
    if (!open) {
      setStep(STEP_SELECT_MANUAL);
      setIsValid(true);
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleNextStep = useCallback(
    (currentStep: number, nextStep: number) => {
      handleStepChange(
        currentStep,
        nextStep,
        {
          aiActionScriptSelectStepNextTrackerSegment,
          aiActionScriptGenerateStepNextClickTrackerSegment
        },
        form
      );
      setStep(nextStep);
    },
    [form, aiActionScriptSelectStepNextTrackerSegment, aiActionScriptGenerateStepNextClickTrackerSegment]
  );

  const handleSubmit = useCallback(() => {
    const exportType = form.get('export').get('exportType').value;

    return new Promise<void>((resolve, reject) => {
      if (exportType === 'internal') {
        //@ts-expect-error
        onSubmit({ form, resolve, reject });
      } else if (exportType === 'github' || exportType === 'gitlab') {
        const data = prepareExportData(form);
        if (data && isExportFormValid(form)) {
          exportScriptToExternalSource({ data });
          onExport({
            exportForm: form.get('export'),
            data,
            setResultUrl,
            closeHandler,
            resolve,
            reject,
            setIsValid
          });
        } else {
          setIsValid(false);
          setForm(form.setTouched(true, { recurse: true }));
          reject();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, onSubmit, exportScriptToExternalSource, onExport, setResultUrl]);

  const submitButtonText = useMemo(
    () => getSubmitButtonText(form),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, form]
  );

  const validateSelectManualStep = useValidateSelectManual({ form, setForm });
  const validateGenerateScript = useGenerateScript({ form, setForm });
  const validateCopyAction = useValidateCopyActionStep({ form, setForm });

  // Check if fields are invalid (true means invalid)
  const isSelectManualFieldValid = isSelectManualFieldsInvalid(form);
  const isGenerateScriptFieldValid = isGenerateScriptFieldsInvalid(form);

  // Check internal fields validity
  const internalFieldsInvalid = (form: GenerateAIScriptActionForm) => {
    return !areFieldsValid(form, [
      ['action', 'name'],
      ['action', 'script'],
      ['action', 'description']
    ]);
  };

  // Check export fields validity
  const exportFieldsInvalid = (form: GenerateAIScriptActionForm) => {
    return !areFieldsValid(form, [
      ['export', 'agent'],
      ['export', 'repository'],
      ['export', 'branch'],
      ['export', 'file_path'],
      ['export', 'message'],
      ['action', 'script']
    ]);
  };

  const validCheck = (updatedform: GenerateAIScriptActionForm) => {
    if (copyActionMount) {
      const exportType = updatedform.get('export').get('exportType').value;
      if (exportType === 'internal') {
        if (internalFieldsInvalid(updatedform)) {
          return true;
        } else {
          if (isValid) return false;
          else return true;
        }
      } else if (exportType === 'github' || exportType === 'gitlab') {
        if (exportFieldsInvalid(updatedform)) {
          return true;
        } else {
          if (isValid) return false;
          else return true;
        }
      } else return false;
    } else {
      return false;
    }
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.automation,
          pageRootName: pageNames.automation_generate_script_with_watsonx
        }}
      />
      <CreateTearsheet
        className={locals['generate-script-window']}
        onClose={onCancel}
        open={open}
        influencerWidth="wide"
        submitButtonText={submitButtonText!}
        cancelButtonText={t('in-automation:GenerateAIActionDialog.confirmButtonLabel')}
        backButtonText={t('in-automation:GenerateAIActionDialog.back')}
        nextButtonText={t('in-automation:GenerateAIActionDialog.next')}
        onRequestSubmit={handleSubmit}
        title={
          <>
            {t('in-automation:GenerateAIActionDialog.generateScriptDialog.dialogHeader')}
            <PreviewPill />
            <div className={locals['configure-override']}>
              <AISlugIcon actionType="script" />
            </div>
          </>
        }
      >
        <CreateTearsheetStep
          title={t('in-automation:GenerateAIActionDialog.generateScriptDialog.step1Title')}
          fieldsetLegendText=""
          description={t('in-automation:GenerateAIActionDialog.generateScriptDialog.step1Headline')}
          onMount={() => {
            setSelectManualMount(true);
          }}
          onNext={async () => {
            await validateSelectManualStep();
            handleNextStep(STEP_SELECT_MANUAL, STEP_GENERATE_SCRIPT);
          }}
          invalid={isSelectManualFieldValid}
        >
          {manualContent && selectManualMount && (
            <SelectManualStep actionName={actionName!} manualContent={manualContent} form={form} setForm={setForm} />
          )}
        </CreateTearsheetStep>
        <CreateTearsheetStep
          title={t('in-automation:GenerateAIActionDialog.generateScriptDialog.step2Title')}
          fieldsetLegendText=""
          description={
            <>
              <Typography variant="body-regular">
                {t('in-automation:GenerateAIActionDialog.generateScriptDialog.step2Headline1')}
              </Typography>
              <br />
              <Typography variant="body-regular">
                <Trans
                  i18nKey="in-automation:GenerateAIActionDialog.generateScriptDialog.step2Headline2"
                  components={{
                    Link: (
                      // @ts-expect-error
                      <Link
                        external
                        href="https://www.ibm.com/docs/en/instana-observability/latest?topic=ma-intelligent-remediation-live-action-generation-watsonx-public-preview"
                      />
                    )
                  }}
                />
              </Typography>
            </>
          }
          onMount={() => {
            setGenerateScriptMount(true);
          }}
          onPrevious={() => {
            setGenerateScriptMount(false);
            setStep(STEP_SELECT_MANUAL);
          }}
          onNext={async () => {
            await validateGenerateScript();
            handleNextStep(STEP_GENERATE_SCRIPT, STEP_COPY_ACTION);
          }}
          invalid={isGenerateScriptFieldValid}
        >
          {generateScriptMount && (
            <GenerateScriptStep
              form={form}
              setForm={setForm}
              forRecommededAction={forRecommededAction}
              eventName={eventName}
            />
          )}
        </CreateTearsheetStep>

        <CreateTearsheetStep
          title={t('in-automation:GenerateAIActionDialog.generateScriptDialog.step3Title')}
          fieldsetLegendText=""
          description=""
          onMount={() => {
            setCopyActionMount(true);
          }}
          onPrevious={() => {
            setCopyActionMount(false);
            setStep(STEP_GENERATE_SCRIPT);
          }}
          onNext={validateCopyAction}
          invalid={validCheck(form)}
        >
          {copyActionMount && (
            <CopyActionStepScriptAction
              form={form}
              setForm={setForm}
              result={result}
              resultUrl={resultUrl}
              setResultUrl={setResultUrl}
            />
          )}
        </CreateTearsheetStep>
      </CreateTearsheet>
    </>
  );
}
