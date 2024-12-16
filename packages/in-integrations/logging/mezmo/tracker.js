/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { track, LOGGING_MEZMO_BUTTON_CLICKED } from 'in-services/tracking/tracking';

export const jumpToMezmo = e => track(LOGGING_MEZMO_BUTTON_CLICKED, e);
