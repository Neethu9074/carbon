/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { track, MOBILE_APPS_ANALYZE_OPEN_SESSION } from 'in-services/tracking/tracking';

// session view
export const openSession = (e?: Object) => track(MOBILE_APPS_ANALYZE_OPEN_SESSION, e);
