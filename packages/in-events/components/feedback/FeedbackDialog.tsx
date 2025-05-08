/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, createField, createMapForm } from 'formalistic';
import React, { FormEvent, useEffect, useState } from 'react';

import { Stack, Typography } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import {
  EVENT_FEEDBACK_SUBMIT,
  EVENT_FEEDBACK_SKIP,
  EVENT_FEEDBACK_NEXT,
  EVENT_FEEDBACK_CLOSED_MANUALLY
} from 'in-services/tracking/tracking';
import { FeedbackConfigEventForm, saveEventFeedbackForm } from 'in-events/components/feedback/api';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { stepConfigs } from 'in-events/components/feedback/stepConfig';
import { LoadingEnd } from 'in-events/components/feedback/LoadingEnd';
import { close } from 'in-components/DialogPresenter/store';
import { eventsPath } from 'in-events/navigation/paths';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/feedback/Feedback.mless';

export default function FeedbackDialog() {
  const { trackCta } = useSegmentTracking();
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'event feedback';

  const [step, setStep] = useState<string>('start_0');
  const [form, setForm] = useState<MapForm<FeedbackConfigEventForm>>(createForm());
  const { location } = useNavigation();

  const nextStep = () => {
    if (currentStepConfig.lastStep) {
      const stepStr = step.split('_')[0];
      setStep(stepStr + '_end');
    } else {
      const stepNum = parseInt(step.split('_')[1]);
      setStep(step.split('_')[0] + `_${stepNum + 1}`);
    }
  };
  const currentStepConfig = stepConfigs[step];
  const onSubmit = (e: FormEvent | null) => {
    if (e) e.preventDefault();
    if (!form.hierarchyValid) {
      form.setTouched(true, { recurse: true });
      return;
    }

    const instrumentation = (instrumentationEventProperties: Object) => {
      trackCta(EVENT_FEEDBACK_SUBMIT, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
    };

    save(form, location, instrumentation);
  };

  useEffect(() => {
    if (currentStepConfig.isEnd) {
      onSubmit(null);
      setTimeout(() => close(), 3 * 1000);
    }
    //eslint-disable-next-line
  }, [currentStepConfig, step]);

  const footer = currentStepConfig.hasFooter ? (
    <DialogFooter
      form={form}
      primaryActionText={
        currentStepConfig.lastStep
          ? t('in-settings:maintenanceWindow.feedback.submit')
          : t('in-components:blueprintFormMultistep.buttonNext')
      }
      primaryActionDisabled={
        !form.hierarchyValid || (currentStepConfig.validateStep && currentStepConfig.validateStep(form))
      }
      onPrimaryActionClick={() => {
        const instrumentationEventProperties = {
          stepTitle: currentStepConfig.title,
          eventID: location.matrix[eventsPath]?.eventId,
          eventType: location.matrix[eventsPath]?.view
        };
        trackCta(EVENT_FEEDBACK_NEXT, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
        nextStep();
      }}
      secondaryActionText={t('in-events:feedback.skip')}
      onSecondaryActionClick={() => {
        const instrumentationEventProperties = {
          stepTitle: currentStepConfig.title,
          eventID: location.matrix[eventsPath]?.eventId,
          eventType: location.matrix[eventsPath]?.view
        };
        trackCta(EVENT_FEEDBACK_SKIP, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
        nextStep();
      }}
    />
  ) : null;
  return (
    <form onSubmit={onSubmit}>
      <DialogWithSlideInView
        title={t('in-settings:maintenanceWindow.feedback.shareFeedback')}
        onClose={() => {
          const feedback = form.get('feedback').value;
          const id = form.get('id').value;

          const contactMe = form.get('contactMe').value;
          const instrumentationEventProperties = {
            id,
            feedback,
            contactMe,
            eventID: location.matrix[eventsPath]?.eventId,
            eventType: location.matrix[eventsPath]?.view
          };
          trackCta(EVENT_FEEDBACK_CLOSED_MANUALLY, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
          close();
        }}
        footer={footer}
      >
        <div className={locals.dialog}>
          <Stack distribution="center" align="center">
            <img src={currentStepConfig.stepImg} className={locals.feedbackImage} />
          </Stack>
          <div className={locals.dialogContent}>
            <Stack gap="medium">
              <Typography variant="heading-500" align={currentStepConfig.titleAlignment} noMargin>
                {currentStepConfig.title}
              </Typography>
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
              <div className={locals.dialogComponent}>{currentStepConfig.component({ nextStep, form, setForm })}</div>
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

function save(form: MapForm<FeedbackConfigEventForm>, location: Location, submitTracker: (e: Object) => void) {
  const feedback = form.get('feedback').value;
  const id = form.get('id').value;

  const contactMe = form.get('contactMe').value;
  return saveEventFeedbackForm(
    {
      id,
      feedback,
      contactMe,
      eventID: location.matrix[eventsPath]?.eventId || '',
      eventType: location.matrix[eventsPath]?.view || ''
    },
    submitTracker
  );
}
