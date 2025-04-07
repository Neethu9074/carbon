/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Spacer, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import generateAIAction, { AIActionContent } from 'in-automation/subscriptions/generateAIAction';
import FeedbackComponent from 'in-automation/AutomationCard/GenerateAI/FeedbackComponent';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import LoadingSection from 'in-automation/AutomationCard/GenerateAI/LoadingSection';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { automationActionAiGenerationUnitEnabled } from 'in-services/featureFlags';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { useSegmentTracker, TrackingFunction } from 'in-automation/tracker';
import ConsentForm from 'in-automation/components/ConsentForm/ConsentForm';
import { error, hasError, isLoading } from 'in-services/util/result';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import { pendingResult } from 'in-services/fixedObjects';
import Code from 'in-components/form/Code/Code';
import CodeComponent from 'in-components/Code';
import { createStore } from 'in-stores/store';
import { t, Trans } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/GenerateAIScriptActionDialog.mless';

const generatedActionStore = createStore<Result<AIActionContent> | null>({
  name: 'in-automation/AutomationCard/GenerateAIActionDialog/Steps/GenerateScriptStep',
  initialValue: null,
  isGlobal: false
});
const generatedAction$ = generatedActionStore.observable;

export const useGeneratedAction = () => useObservable(generatedAction$, []) ?? null;

export const setGeneratedAction = (action: Result<AIActionContent> | null) => generatedActionStore.mutateTo(action);

function EmptySection() {
  return (
    <FormGroup>
      <div className={locals.header}>
        <Typography variant="heading-200" component="h2">
          {t('in-automation:GenerateAIActionDialog.generateScriptDialog.titleGeneratedCodeReadOnly')}
        </Typography>
      </div>
      <NoDataAvailable
        height={400}
        className={locals.noResults}
        title={t('in-automation:GenerateAIActionDialog.noResultsYet')}
        // @ts-expect-error
        text={
          <LeftRightPadding>
            <Trans i18nKey="in-automation:GenerateAIActionDialog.generateScriptDialog.noDataAvailableLive" />
          </LeftRightPadding>
        }
      />
    </FormGroup>
  );
}

function generateAIActionForm({
  form,
  setForm,
  aiActionScriptGenerateAIButtonTrackerSegment,
  aiActionGenerateErrorTrackerSegment
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
  aiActionScriptGenerateAIButtonTrackerSegment: TrackingFunction;
  aiActionGenerateErrorTrackerSegment: TrackingFunction;
}) {
  const promptForm = form.get('prompt');

  const promptStep = promptForm.get('promptStep');
  const generateAIScriptActionPayload = {
    actionType: 'SCRIPT' as const,
    tasks: [
      {
        id: '0',
        interpreter: 'BASH' as const,
        task: promptStep.value.trim()
      }
    ]
  };

  setGeneratedAction(pendingResult);
  generateAIAction(generateAIScriptActionPayload)
    .filter(res => !isLoading(res))
    .once(
      res => {
        setGeneratedAction(res);
        // tracker tracks prompt input and output and tokens
        aiActionScriptGenerateAIButtonTrackerSegment({
          generateAIScriptActionPayload,
          resultContent: res.data?.content!,
          tokens: {
            inputTokenCount: res.data?.inputTokenCount!,
            outputTokenCount: res.data?.outputTokenCount!,
            totalTokenCount: res.data?.totalTokenCount!
          }
        });
        setForm(form =>
          form
            .updateIn(['action', 'script'], item => item.setValue(res.data?.content!))
            .updateIn(['action', 'aiGeneratedContent'], item => item.setValue(res.data?.content!))
            .updateIn(['action', 'description'], item => item.setValue(promptStep.value).setTouched(true))
            .updateIn(['action', 'feedbackState'], item => item.setValue('').setTouched(true))
        );
      },
      result => {
        aiActionGenerateErrorTrackerSegment({
          generateAIScriptActionPayload,
          errors: result?.errors,
          type: 'script'
        });
        setGeneratedAction(error(result?.errors));
      }
    );
}

function GenerateScriptButton({
  form,
  setForm
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
}) {
  const generatedAction = useGeneratedAction();
  const promptForm = form.get('prompt');
  const { aiActionScriptGenerateAIButtonTrackerSegment, aiActionGenerateErrorTrackerSegment } = useSegmentTracker();
  return (
    <>
      <Button
        kind="secondary"
        className={locals.generateScriptButton}
        disabled={
          (!promptForm.hierarchyValid && promptForm.hierarchyTouched) ||
          (!!generatedAction && isLoading(generatedAction)) ||
          !automationActionAiGenerationUnitEnabled
        }
        onClick={() => {
          if (!promptForm.hierarchyValid) {
            setForm(form.updateIn(['prompt'], promptForm => promptForm.setTouched(true, { recurse: true })));
            return;
          }
          generateAIActionForm({
            form,
            setForm,
            aiActionScriptGenerateAIButtonTrackerSegment,
            aiActionGenerateErrorTrackerSegment
          });
        }}
        icon="lib_generate_ai"
      >
        {t('in-automation:GenerateAIActionDialog.generateScriptDialog.generateScriptButton')}
      </Button>
    </>
  );
}

function ActionPreview({
  form,
  setForm
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
}) {
  const generatedAction = useGeneratedAction();

  if (!generatedAction) return <EmptySection />;
  if (isLoading(generatedAction))
    return (
      <LoadingSection
        title={t('in-automation:GenerateAIActionDialog.generateScriptDialog.titleGeneratedCodeReadOnly')}
      />
    );
  if (hasError(generatedAction)) return <ErroneousResultPresenter errors={generatedAction.errors} />;
  return <ScriptSection form={form} setForm={setForm} />;
}

function ScriptSection({
  form,
  setForm
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
}) {
  const plaintextScript = form.get('action').get('aiGeneratedContent').value;
  const promptForm = form.get('prompt');

  const promptStep = promptForm.get('promptStep');
  const trackerPayload = { prompt: promptStep.value, generatedContent: plaintextScript, type: 'script' };
  return (
    <FormGroup>
      <div className={locals.header}>
        <Typography variant="heading-200" component="h2">
          {t('in-automation:GenerateAIActionDialog.generateScriptDialog.titleGeneratedCodeReadOnly')}
        </Typography>
      </div>
      <div className={locals.CodeWithAISlug}>
        <CodeComponent withExpandButton linesToShow={20} code={plaintextScript} lang={'bash'} softWrap />
      </div>
      <FeedbackComponent
        trackerPayload={trackerPayload}
        form={form.get('action')}
        setForm={actionForm => setForm(form => form.updateIn(['action'], actionForm))}
      />
    </FormGroup>
  );
}

export default function GenerateScriptStep({
  form,
  setForm
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
}) {
  const promptForm = form.get('prompt');
  const promptStep = promptForm.get('promptStep');
  const { clickEPWTLink } = useSegmentTracker();
  const onChangeValue = (val: string) => {
    setForm(form => form.updateIn(['prompt', 'promptStep'], item => item.setValue(val).setTouched(true)));
    setForm(form =>
      form.updateIn(['action', 'description'], item =>
        item.setValue(`This action has script for  ${val}`).setTouched(true)
      )
    );
  };

  const handleClick = () => {
    clickEPWTLink({
      type: { type: 'scriptActionGeneration' }
    });
  };

  return (
    <>
      <Spacer vertical="large" />
      <div className={locals.step2Description}>
        <Typography variant="body-regular">
          {t('in-automation:GenerateAIActionDialog.generateScriptDialog.step2Headline1')}
        </Typography>
        <Typography variant="body-regular">
          {t('in-automation:GenerateAIActionDialog.generateScriptDialog.step2Headline2')}
        </Typography>
      </div>
      <Spacer vertical="large" />
      <Row className={locals.generateScriptStep}>
        <Col lg={6}>
          <Spacer vertical="normal" />

          {promptStep.map(field => (
            <FormGroup>
              <div className={locals.header}>
                <Typography variant="heading-200" component="h2">
                  {t('in-automation:GenerateAIActionDialog.generateScriptDialog.promptTitle')}
                </Typography>
              </div>
              <div className={locals.promptCode}>
                <Code mode="markdown" lineWrapping value={field.value} onChange={onChangeValue} />
                <GenerateScriptButton form={form} setForm={setForm} />
              </div>
              <TouchedMessages field={field} />

              {!automationActionAiGenerationUnitEnabled && <ConsentForm onClick={handleClick} />}
            </FormGroup>
          ))}
        </Col>
        <Col lg={6}>
          <Spacer vertical="normal" />
          <ActionPreview form={form} setForm={setForm} />
        </Col>
      </Row>
    </>
  );
}
