/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, createField, createMapForm } from 'formalistic';
import React, { FormEvent, useEffect, useState } from 'react';

import { Stack, Typography, Button } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { Error, ErrorCode } from '@instana/types';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { FeedbackConfigEventForm, saveEventFeedbackForm } from 'in-events/components/feedback/api';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { IStepConfig } from 'in-events/components/feedback/eventStepConfig';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { LoadingEnd } from 'in-events/components/feedback/LoadingEnd';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { close } from 'in-components/DialogPresenter/store';
import { eventsPath } from 'in-events/navigation/paths';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/feedback/Feedback.mless';

interface FeedbackDialogProps {
  stepConfig: IStepConfig;
  closedManuallyTracker: (e: Object) => void;
  nextStepTracker: (e: Object) => void;
  skipStepTracker: (e: Object) => void;
  submitTracker: (e: Object) => void;
  eventData?: EventOrMap;
}

export default function EventFeedbackDialog({
  stepConfig,
  closedManuallyTracker,
  nextStepTracker,
  skipStepTracker,
  submitTracker,
  eventData
}: FeedbackDialogProps) {
  const [step, setStep] = useState<string>('start_0');
  const [form, setForm] = useState<MapForm<FeedbackConfigEventForm>>(createForm());
  const [error, setError] = useState<Error[]>([]);
  const { location } = useNavigation();

  const nextStep = () => {
    if (currentStepConfig.lastStep({ form, eventData })) {
      const stepStr = step.split('_')[0];
      setStep(stepStr + '_end');
      onSubmit(null);
    } else {
      const stepNum = parseInt(step.split('_')[1]);
      setStep(step.split('_')[0] + `_${stepNum + 1}`);
    }
  };
  const currentStepConfig = stepConfig[step];
  const onSubmit = (e: FormEvent | null) => {
    if (e) e.preventDefault();
    if (!form.hierarchyValid) {
      form.setTouched(true, { recurse: true });
      return;
    }
    save(form, submitTracker);
  };

  useEffect(() => {
    if (currentStepConfig.isEnd) {
      setTimeout(() => close(), 3 * 1000);
    }
    //eslint-disable-next-line
  }, [currentStepConfig, step]);

  const footer = currentStepConfig.hasFooter ? (
    <FormFooter className={locals.controls}>
      {currentStepConfig.canSkip && (
        <Button
          kind="secondary"
          onClick={() => {
            skipStepTracker({
              stepTitle: currentStepConfig.title,
              eventID: location.matrix[eventsPath]?.eventId,
              eventType: location.matrix[eventsPath]?.view
            });
            nextStep();
          }}
        >
          {t('in-events:feedback.skip')}
        </Button>
      )}
      <SaveButton
        type="submit"
        kind="primary"
        form={form}
        disabled={!form.hierarchyValid || (currentStepConfig.validateStep && currentStepConfig.validateStep(form))}
        onClick={() => {
          if (currentStepConfig.requestBeforeEnd) {
            const apiObject = currentStepConfig.requestBeforeEnd.apiObject(form, setError);
            if (apiObject) {
              const observable = currentStepConfig.requestBeforeEnd.apiObservable(
                eventData?.get('id') as string,
                apiObject
              );
              observable.once(() => {
                nextStepTracker({
                  stepTitle: currentStepConfig.title,
                  eventID: location.matrix[eventsPath]?.eventId,
                  eventType: location.matrix[eventsPath]?.view
                });
                nextStep();
              });

              observable.errors().once(data => {
                setError([
                  {
                    code: (data.response.statusText as string).toUpperCase().replace(' ', '_') as ErrorCode,
                    message: data.message as string
                  }
                ]);
              });
            }
          } else {
            nextStepTracker({
              stepTitle: currentStepConfig.title,
              eventID: location.matrix[eventsPath]?.eventId,
              eventType: location.matrix[eventsPath]?.view
            });
            nextStep();
          }
        }}
      >
        {currentStepConfig.lastStep({ form, eventData })
          ? t('in-settings:maintenanceWindow.feedback.submit')
          : t('in-components:blueprintFormMultistep.buttonNext')}
      </SaveButton>
    </FormFooter>
  ) : null;
  return (
    <form onSubmit={onSubmit}>
      <DialogWithSlideInView
        title={
          currentStepConfig.customCardTitle
            ? currentStepConfig.customCardTitle
            : t('in-settings:maintenanceWindow.feedback.shareFeedback')
        }
        onClose={() => {
          const feedback = form.get('feedback').value;
          const id = form.get('id').value;

          const contactMe = form.get('contactMe').value;
          closedManuallyTracker({
            id,
            feedback,
            contactMe,
            eventID: location.matrix[eventsPath]?.eventId,
            eventType: location.matrix[eventsPath]?.view
          });
          close();
        }}
        footer={footer}
        doNotCloseOnOutsideClick
      >
        <div className={locals.dialog}>
          <Stack distribution="center" align="center">
            <img src={currentStepConfig.stepImg} className={locals.feedbackImage} />
          </Stack>
          <div className={currentStepConfig.noBodyPadding ? locals.dialogContentNoPadding : locals.dialogContent}>
            <Stack gap="medium">
              {currentStepConfig.title && (
                <Typography variant="heading-500" align={currentStepConfig.titleAlignment} noMargin>
                  {currentStepConfig.title}
                </Typography>
              )}

              {currentStepConfig.DescriptionComponent &&
                currentStepConfig.DescriptionComponent({ nextStep, form, setForm, eventData })}
              {currentStepConfig.description && Array.isArray(currentStepConfig.description) && (
                <Stack gap="xxsmall">
                  {currentStepConfig.description.map((description, idx) => (
                    <Typography variant="body-large" align={currentStepConfig.descriptionAlignment} key={idx}>
                      <div className={locals.feedbackDescription}>{description}</div>
                    </Typography>
                  ))}
                </Stack>
              )}
              {currentStepConfig.description && !Array.isArray(currentStepConfig.description) && (
                <Typography variant="body-large" align={currentStepConfig.descriptionAlignment}>
                  <div className={locals.feedbackDescription}>{currentStepConfig.description}</div>
                </Typography>
              )}

              <div className={locals.dialogComponent}>
                {currentStepConfig.component({ nextStep, form, setForm, eventData })}
              </div>
              <ErroneousResultPresenter errors={error} />
            </Stack>
          </div>
        </div>
        {currentStepConfig.isEnd && <LoadingEnd currentTimeStamp={new Date().getTime()} />}
      </DialogWithSlideInView>
    </form>
  );
}

function createForm(): MapForm<FeedbackConfigEventForm> {
  return createMapForm<FeedbackConfigEventForm>({
    items: {
      id: createField({ value: generateUniqueShortId() }),
      feedback: createField({ value: '' }),
      contactMe: createField({ value: undefined }),
      closureComments: createField({ value: '' }),
      muteAlerts: createField({ value: false }),
      disableEvent: createField({ value: false })
    }
  });
}

function save(form: MapForm<FeedbackConfigEventForm>, submitTracker: (e: Object) => void) {
  const feedback = form.get('feedback').value;
  const id = form.get('id').value;

  const contactMe = form.get('contactMe').value;
  const config = {
    id,
    feedback,
    contactMe
  };
  return saveEventFeedbackForm(config, submitTracker);
}
