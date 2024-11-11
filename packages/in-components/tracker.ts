/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CHART_ZOOM_INTO_TIMEFRAME, track } from 'in-services/tracking/tracking';

export const chartZoomInTracker = (e: { chartMetrics: string[] }) => track(CHART_ZOOM_INTO_TIMEFRAME, e);
