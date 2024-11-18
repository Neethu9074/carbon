/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { track, ANALYZE_UA2_CHART_CHANGED } from 'in-services/tracking/tracking';

export const ua2ChartChangedTracker = (e?: Object) => track(ANALYZE_UA2_CHART_CHANGED, e);
