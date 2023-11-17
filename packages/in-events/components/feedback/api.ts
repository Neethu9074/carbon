/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { Field, MapFormItems } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';

import { eventFeedbackSubmitTracker } from 'in-events/tracker';

export interface FeedbackConfigEvent {
  id: string;
  thingsWentWrong: string;
  contactMe: boolean | undefined;
  eventID?: string;
  eventType?: string;
}

export interface FeedbackConfigEventForm extends MapFormItems {
  id: Field<string>;
  thingsWentWrong: Field<string>;
  contactMe: Field<boolean | undefined>;
}

export function saveEventFeedbackForm(config: FeedbackConfigEvent) {
  eventFeedbackSubmitTracker(config);
}

export function createFeedbackForm(): FeedbackConfigEvent {
  return {
    id: generateUniqueShortId(),
    thingsWentWrong: '',
    contactMe: undefined
  };
}
