/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { Field, MapFormItems } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';

import { maintenanceWindowCTATracker } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/tracker';
import { SETTINGS_MAINTENANCE_WINDOW_FEEDBACK_SUBMIT } from 'in-services/tracking/eventNames';

export type FeedbackFeelingRMW = 'AWESOME' | 'MEH' | 'TERRIBLE';

export interface FeedbackConfigRMW {
  id: string;
  feeling: FeedbackFeelingRMW | string;
  stepOne: string;
  stepTwo: string;
  stepThree: string;
}

export interface FeedbackConfigRMWForm extends MapFormItems {
  id: Field<string>;
  feeling: Field<FeedbackFeelingRMW> | Field<string>;
  stepOne: Field<string>;
  stepTwo: Field<string>;
  stepThree: Field<string>;
}

export function saveFeedbackForm(config: FeedbackConfigRMW) {
  maintenanceWindowCTATracker(SETTINGS_MAINTENANCE_WINDOW_FEEDBACK_SUBMIT, '', undefined, JSON.stringify(config));
}

export function createFeedbackForm(): FeedbackConfigRMW {
  return {
    id: generateUniqueShortId(),
    feeling: '',
    stepOne: '',
    stepTwo: '',
    stepThree: ''
  };
}
