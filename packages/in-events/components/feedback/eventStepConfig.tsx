/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Align } from '@instana/components/types/components/Typography/types';
import { Stack, Typography } from '@instana/components';
import { Error, ManualCloseInfo } from '@instana/types';
import { Observable } from '@instana/observables';

import { EVENT_TYPES, getEventSeverityLabelWithEventType, getEventType } from 'in-stores/events';
import problematic_end from 'in-events/components/feedback/assets/problematic_end.png';
import feedback_two from 'in-events/components/feedback/assets/feedback_two.png';
import FeedbackStepThree from 'in-events/components/feedback/FeedbackStepThree';
import FeedbackStepOne from 'in-events/components/feedback/FeedbackStepOne';
import FeedbackStepTwo from 'in-events/components/feedback/FeedbackStepTwo';
import { FeedbackConfigEventForm } from 'in-events/components/feedback/api';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import EventIcon from 'in-events/components/EventIcon';
import { manuallyCloseIssue } from 'in-events/api';
import { EventOrMap } from 'in-events/types';
import { role, user } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

export interface FeedbackStepConfigs {
  nextStep: () => void;
  form: MapForm<FeedbackConfigEventForm>;
  setForm: (form: MapForm<any>) => void;
  eventData?: EventOrMap;
}

export interface StepConfig {
  title: string;
  customCardTitle?: string;
  titleAlignment: Align;
  description?: string | string[]; // Description text
  descriptionAlignment?: Align;
  stepImg?: string; // If you want an image associated with a given step
  component: (props: FeedbackStepConfigs) => JSX.Element; // What component to render
  DescriptionComponent?: (props: FeedbackStepConfigs) => JSX.Element; // If you want a custom description component
  validateStep?: (form: MapForm<FeedbackConfigEventForm>) => boolean; // Return true if you want the submit/next button to be disabled
  requestBeforeEnd?: {
    //Before submitting to next step is there a request?
    apiObservable: (eventId: string, manualCloseInfo: ManualCloseInfo) => Observable<ManualCloseInfo>; // Gives observable to use to make request
    // function that provides you with the object to send to backend via above observable
    apiObject: (
      form: MapForm<FeedbackConfigEventForm>,
      setError: React.Dispatch<React.SetStateAction<Error[]>>
    ) => ManualCloseInfo | null;
  };
  hasFooter: boolean; // if a footer should be rendered
  isEnd: boolean; // if this is the last screen before it closes automatically
  lastStep: (stepVars: { form: MapForm<FeedbackConfigEventForm>; eventData: EventOrMap | undefined }) => boolean; // If the button should say next or submit
  canSkip: boolean; // If a skip button should be rendered
  noBodyPadding?: boolean;
}

export interface IStepConfig {
  [key: string]: StepConfig;
}

const canManuallyCloseIssue = role?.canManuallyCloseIssue;

export const eventStepConfig: IStepConfig = {
  start_0: {
    title: t('in-settings:maintenanceWindow.feedback.problematicStep0Title'),
    titleAlignment: 'left',
    description: [
      t('in-events:feedback.descriptionUnpleasant.firstLineApology'),
      t('in-events:feedback.descriptionUnpleasant.secondLineQuestion')
    ],
    descriptionAlignment: 'left',
    stepImg: feedback_two,
    component: ({ form, setForm, nextStep }: FeedbackStepConfigs) => (
      <FeedbackStepOne nextStep={nextStep} form={form} setForm={setForm} />
    ),
    validateStep: (form: MapForm<FeedbackConfigEventForm>) => {
      if (form && form.get('thingsWentWrong') && !form.get('thingsWentWrong').touched) return true;
      if (
        form &&
        form.get('thingsWentWrong') &&
        form.get('thingsWentWrong').touched &&
        form.get('thingsWentWrong').value.length <= 0
      )
        return true;
      return false;
    },
    hasFooter: true,
    lastStep: () => false,
    isEnd: false,
    canSkip: true
  },
  start_1: {
    title: t('in-events:feedback.appreciateResponse'),
    titleAlignment: 'left',
    description: t('in-events:feedback.followUpQuestion'),
    descriptionAlignment: 'left',
    stepImg: feedback_two,
    component: ({ nextStep, form, setForm }: FeedbackStepConfigs) => (
      <FeedbackStepTwo nextStep={nextStep} form={form} setForm={setForm} />
    ),
    validateStep: (form: MapForm<FeedbackConfigEventForm>) => {
      if (form && form.get('contactMe') && !form.get('contactMe').touched) return true;
      if (form && form.get('contactMe') && form.get('contactMe').touched && form.get('contactMe').value === undefined)
        return true;
      return false;
    },
    hasFooter: true,
    lastStep: stepVars => {
      const { eventData } = stepVars;
      if (
        !canManuallyCloseIssue ||
        (eventData && getEventType(eventData) !== EVENT_TYPES.INCIDENT) ||
        (eventData && eventData?.get('state') === 'manually_closed') ||
        eventData?.get('state') === 'closed'
      )
        return true;

      return false;
    },
    isEnd: false,
    canSkip: true
  },
  start_2: {
    title: '',
    customCardTitle: t('in-events:closeEventDialog.closeIncidentFeedbackTitle'),
    titleAlignment: 'left',
    DescriptionComponent: ({ eventData }: FeedbackStepConfigs) => (
      <Stack>
        <Stack direction="horizontal" gap="xsmall">
          <EventIcon
            event={eventData}
            tooltipLabel={getEventSeverityLabelWithEventType(
              eventData as EventOrMap,
              getTimeConfigFromEvent(eventData as EventOrMap)
            )}
          />
          <Typography variant="heading-100">{eventData?.getIn(['problem', 'problemText'], '')}</Typography>
        </Stack>
        <Typography variant="body-regular">
          <Trans
            i18nKey={'in-events:closeEventDialog.closingWillAlsoCloseWarning'}
            values={{
              event_problem_text: eventData?.getIn(['problem', 'problemText'], '')
            }}
          />
        </Typography>
      </Stack>
    ),
    component: ({ eventData, form, setForm, nextStep }: FeedbackStepConfigs) => (
      <FeedbackStepThree eventData={eventData} form={form} setForm={setForm} nextStep={nextStep} />
    ),
    validateStep: form => {
      if (form && form.get('closureComments') && !form.get('closureComments').touched) return true;
      if (
        form &&
        form.get('closureComments') &&
        form.get('closureComments').touched &&
        !form.get('closureComments').value
      )
        return true;
      return false;
    },
    hasFooter: true,
    lastStep: () => true,
    requestBeforeEnd: {
      apiObservable: manuallyCloseIssue,
      apiObject: (form: MapForm<FeedbackConfigEventForm>, setError: React.Dispatch<React.SetStateAction<Error[]>>) => {
        const closureComments = form.get('closureComments').value;
        if (!closureComments) {
          setError([{ message: 'No comments', code: 'VALIDATION' }]);
          return null;
        }
        //@ts-expect-error
        const username = user?.email || user?.fullName || user?.id;

        return {
          closeTimestamp: Date.now(),
          reasonForClosing: closureComments,
          username,
          muteAlerts: false,
          disableEvent: false
        };
      }
    },
    isEnd: false,
    canSkip: true,
    noBodyPadding: true
  },
  start_end: {
    title: t('in-settings:maintenanceWindow.feedback.problematicEndTitle'),
    titleAlignment: 'center',
    description: t('in-settings:maintenanceWindow.feedback.problematicEndDescription'),
    descriptionAlignment: 'center',
    stepImg: problematic_end,
    component: () => <></>,
    hasFooter: false,
    lastStep: () => true,
    isEnd: true,
    canSkip: true
  }
};
