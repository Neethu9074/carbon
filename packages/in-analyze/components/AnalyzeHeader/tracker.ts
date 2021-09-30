/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { track, ANALYZE_VIEW_SELECTED } from 'in-services/tracking/tracking';

export const analyzeViewSelected = (e: any) => track(ANALYZE_VIEW_SELECTED, e);
