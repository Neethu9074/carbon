/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { Field, MapFormItems } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';

export interface FeedbackConfigEvent {
  id: string;
  feedback: string;
  contactMe: boolean | undefined;
  eventID?: string;
  eventType?: string;
}

export interface FeedbackConfigEventForm extends MapFormItems {
  id: Field<string>;
  feedback: Field<string>;
  contactMe: Field<boolean | undefined>;
  closureComments: Field<string>;
  muteAlerts: Field<boolean>;
  disableEvent: Field<boolean>;
}

export function saveEventFeedbackForm(config: FeedbackConfigEvent, feedbackSubmitTracker: (e: Object) => void) {
  feedbackSubmitTracker(config);
}

export function createFeedbackForm(): FeedbackConfigEvent {
  return {
    id: generateUniqueShortId(),
    feedback: '',
    contactMe: undefined
  };
}
