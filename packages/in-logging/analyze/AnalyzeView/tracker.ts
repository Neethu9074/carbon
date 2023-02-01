/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  ANALYZE_LOGGING_JUMP_TO_LOGS,
  ANALYZE_LOGGING_LOG_MESSAGE_PARAMETER_CLICKED,
  ANALYZE_LOGGING_LOG_MESSAGE_TAG_CLICKED,
  ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED,
  ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED,
  ANALYZE_LOGGING_SELECTED_TAGS_CHANGED,
  ANALYZE_LOGGING_SORTING_CHANGED,
  ANALYZE_LOGGING_TIME_SPENT,
  track
} from 'in-services/tracking/tracking';

export const filterAdded = (e: any) => track(ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED, e);
export const groupAdded = (e: any) => track(ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED, e);
export const selectedChanged = (e: any) => track(ANALYZE_LOGGING_SELECTED_TAGS_CHANGED, e);
export const logMessageParameterClicked = (e: { key?: string }) =>
  track(ANALYZE_LOGGING_LOG_MESSAGE_PARAMETER_CLICKED, e);
export const logMessageTagClicked = (e: any) => track(ANALYZE_LOGGING_LOG_MESSAGE_TAG_CLICKED, e);
export const jumpToLogs = (e: any) => track(ANALYZE_LOGGING_JUMP_TO_LOGS, e);
export const timeSpent = (e: { millisSpentOnAnalyzeView: number }) => track(ANALYZE_LOGGING_TIME_SPENT, e);
export const sortingChanged = (e: Record<string, string>) => track(ANALYZE_LOGGING_SORTING_CHANGED, e);
