/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { track, LOGGING_LOGDNA_BUTTON_CLICKED } from 'in-services/tracking/tracking';

export const jumpToLogDna = e => track(LOGGING_LOGDNA_BUTTON_CLICKED, e);
