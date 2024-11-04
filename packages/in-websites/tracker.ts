/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { track, WEBSITES_ANALYZE_OPEN_PAGE_LOAD, ANALYZE_UA2_CHART_CHANGED } from 'in-services/tracking/tracking';

export const openPageLoad = (e?: Object) => track(WEBSITES_ANALYZE_OPEN_PAGE_LOAD, e);
export const ua2ChartChangedTracker = (e?: Object) => track(ANALYZE_UA2_CHART_CHANGED, e);
