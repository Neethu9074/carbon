/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button, Spacer, Typography, PreviewPill } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Event, Result } from '@instana/types';

import { GenerateAIActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/useGenerateAIActionForm';
import { setSelectedAction } from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/Steps/SelectActionStep';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import ManualActionContent from 'in-automation/components/ManualActionContent/ManualActionContent';
import generateAIAction, { AIActionContent } from 'in-automation/subscriptions/generateAIAction';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { useSegmentTracker, TrackingFunction } from 'in-automation/tracker';
import { error, hasError, isLoading } from 'in-services/util/result';
import { createManualField } from 'in-automation/utils/actionField';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import TextArea from 'in-components/form/TextArea/TextArea';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import { pendingResult } from 'in-services/fixedObjects';
import { createStore } from 'in-stores/store';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { Trans, t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/GenerateAIActionDialog.mless';

const generatedActionStore = createStore<Result<AIActionContent> | null>({
  name: 'in-automation/AutomationCard/GenerateAIActionDialog/Steps/PromptStep',
  initialValue: null,
  isGlobal: false
});
const generatedAction$ = generatedActionStore.observable;

export const useGeneratedAction = () => useObservable(generatedAction$, []) ?? null;

export const setGeneratedAction = (action: Result<AIActionContent> | null) => generatedActionStore.mutateTo(action);

function PromptInputs({
  form,
  setForm
}: {
  form: GenerateAIActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
}) {
  const promptForm = form.get('prompt');
  const eventName = promptForm.get('eventName');
  const eventDescription = promptForm.get('eventDescription');
  const eventEntityType = promptForm.get('eventEntityType');

  return (
    <>
      {eventName.map(field => (
        <FormGroup>
          <Label htmlFor="event-name" hasError={!field.valid && field.touched}>
            {t('in-automation:GenerateAIActionDialog.eventName')}
          </Label>
          <Input
            id="event-name"
            type="text"
            value={field.value}
            onChange={e =>
              setForm(form =>
                form.updateIn(['prompt', 'eventName'], item => item.setValue(e.target.value).setTouched(true))
              )
            }
            hasError={!field.valid && field.touched}
            maxLength={256}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {eventDescription.map(field => (
        <FormGroup>
          <Label htmlFor="event-description" hasError={!field.valid && field.touched}>
            {t('in-automation:GenerateAIActionDialog.eventDescription')}
          </Label>
          <TextArea
            id="event-description"
            value={field.value}
            onChange={e =>
              setForm(form =>
                form.updateIn(['prompt', 'eventDescription'], item =>
                  item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                )
              )
            }
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {eventEntityType.map(field => (
        <FormGroup>
          <Label htmlFor="entityType-name" hasError={!field.valid && field.touched}>
            {t('in-automation:GenerateAIActionDialog.eventEntityType')}
          </Label>
          <Input
            id="entityType-name"
            type="text"
            value={field.value}
            onChange={e =>
              setForm(form =>
                form.updateIn(['prompt', 'eventEntityType'], item => item.setValue(e.target.value).setTouched(true))
              )
            }
            hasError={!field.valid && field.touched}
            maxLength={256}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </>
  );
}

function generateAIActionForm({
  form,
  setForm,
  event,
  generateAIClickPromptStepTrackerSegment
}: {
  form: GenerateAIActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
  event: Event;
  generateAIClickPromptStepTrackerSegment: TrackingFunction;
}) {
  const promptForm = form.get('prompt');
  const eventName = promptForm.get('eventName').value;
  const eventDescription = promptForm.get('eventDescription').value;
  const eventEntityType = promptForm.get('eventEntityType').value;
  const eventId = event.id;
  const generateAIActionPayload = {
    eventId,
    eventName,
    eventDescription,
    eventEntityType
  };

  setGeneratedAction(pendingResult);
  setSelectedAction(null);
  generateAIAction(generateAIActionPayload)
    .filter(res => !isLoading(res))
    .once(
      res => {
        setGeneratedAction(res);
        // tracker tracks prompt input and output
        generateAIClickPromptStepTrackerSegment({
          generateAIActionPayload,
          resultContent: res.data?.content!
        });
        setForm(form =>
          form
            .updateIn(['action', 'name'], item => item.setValue(`Action generated for ${eventName}`).setTouched(false))
            .updateIn(['action', 'description'], item =>
              item.setValue(`This resolves event with ${eventDescription}`).setTouched(false)
            )
            .updateIn(['action', 'content'], item => item.setValue(res.data?.content!))
            .updateIn(['action', 'tags'], item => item.setValue(['watsonx']).setTouched(true))
            .updateIn(['action', 'type'], item => item.setValue('MANUAL').setTouched(true))
            .updateIn(['action', 'script'], item => item.setValue(''))
            .updateIn(['action', 'aiGeneratedContent'], item => item.setValue(res.data?.content!))
        );
      },
      () => {
        setGeneratedAction(
          error([{ message: t('in-automation:GenerateAIActionDialog.failedToGenerateAction'), code: 'SERVER' }])
        );
      }
    );
}

function GenerateButton({
  form,
  setForm,
  event
}: {
  form: GenerateAIActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
  event: Event;
}) {
  const generatedAction = useGeneratedAction();
  const promptForm = form.get('prompt');

  const { generateAIClickPromptStepTrackerSegment } = useSegmentTracker();
  return (
    <Button
      kind={carbonButtonEnabled ? 'secondary' : 'primaryv2'}
      disabled={
        (!promptForm.hierarchyValid && promptForm.hierarchyTouched) || (!!generatedAction && isLoading(generatedAction))
      }
      onClick={() => {
        if (!promptForm.hierarchyValid) {
          setForm(form.updateIn(['prompt'], promptForm => promptForm.setTouched(true, { recurse: true })));
          return;
        }
        generateAIActionForm({ form, setForm, event, generateAIClickPromptStepTrackerSegment });
      }}
      icon="lib_launch_ai"
    >
      {t('in-automation:GenerateAIActionDialog.generateAction')}
    </Button>
  );
}

function EmptySection() {
  return (
    <FormGroup>
      <div className={locals.header}>
        <Typography variant="heading-200" component="h2">
          {t('in-automation:titleContentReadOnly')}
        </Typography>
      </div>
      <NoDataAvailable
        height={500}
        title={t('in-automation:GenerateAIActionDialog.noResultsYet')}
        // @ts-expect-error
        text={
          <LeftRightPadding>
            <Trans i18nKey="in-automation:GenerateAIActionDialog.noDataAvailableLive" />
          </LeftRightPadding>
        }
      />
    </FormGroup>
  );
}

function ActionPreview() {
  const generatedAction = useGeneratedAction();

  if (!generatedAction) return <EmptySection />;
  if (isLoading(generatedAction))
    return <LoadingIndicator text={t('in-automation:GenerateAIActionDialog.watsonxLoadingContent')} />;
  if (hasError(generatedAction)) return <ErroneousResultPresenter errors={generatedAction.errors} />;
  return <ManualActionContent content={createManualField(generatedAction.data?.content!)} withAISlug />;
}

export default function PromptStep({
  form,
  setForm,
  event
}: {
  form: GenerateAIActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
  event: Event;
}) {
  return (
    <Row>
      <Col lg={7}>
        <Spacer vertical="normal" />
        <PreviewPill privatePreview />
        <Spacer vertical="normal" />
        <Typography variant="body-regular">{t('in-automation:GenerateAIActionDialog.Step1HeadlinePrompt')}</Typography>
        <Spacer vertical="normal" />
        <PromptInputs form={form} setForm={setForm} />
        <GenerateButton form={form} setForm={setForm} event={event} />
      </Col>
      <Col lg={5}>
        <Spacer vertical="normal" />
        <ActionPreview />
      </Col>
    </Row>
  );
}
