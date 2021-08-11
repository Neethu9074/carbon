/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED,
  ANALYZE_LOGGING_QUERY_BUILDER_QUERY_CHANGED,
  ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED,
  ANALYZE_LOGGING_QUERY_BUILDER_CHART_CHANGED,
  ANALYZE_LOGGING_LOAD_MORE_CLICKED,
  ANALYZE_LOGGING_SELECTED_TAGS_CHANGED,
  ANALYZE_LOGGING_TIMEFRAME_USED,
  ANALYZE_LOGGING_LOG_MESSAGE_PARAMETER_CLICKED,
  ANALYZE_LOGGING_LOG_TAG_CLICKED,
  ANALYZE_LOGGING_FACETTEDSEARCH_ITEM_CLICKED,
  ANALYZE_LOGGING_FACETTEDSEARCH_GROUP_CLICKED,
  ANALYZE_LOGGING_JUMP_TO_LOGS,
  ANALYZE_LOGGING_TIME_SPENT
} from 'in-services/tracking/tracking';

export const filterAdded = (e: any) => track(ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED, e);
export const queryChanged = (e: any) => track(ANALYZE_LOGGING_QUERY_BUILDER_QUERY_CHANGED, e);
export const groupAdded = (e: any) => track(ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED, e);
export const chartChanged = (e: any) => track(ANALYZE_LOGGING_QUERY_BUILDER_CHART_CHANGED, e);
export const selectedChanged = (e: any) => track(ANALYZE_LOGGING_SELECTED_TAGS_CHANGED, e);
export const loadMoreClicked = (e: any) => track(ANALYZE_LOGGING_LOAD_MORE_CLICKED, e);
export const timeframeUsed = (e: any) => track(ANALYZE_LOGGING_TIMEFRAME_USED, e);
export const logMessageParameterClicked = (e: any) => track(ANALYZE_LOGGING_LOG_MESSAGE_PARAMETER_CLICKED, e);
export const logMessageTagClicked = (e: any) => track(ANALYZE_LOGGING_LOG_TAG_CLICKED, e);
export const facettedSearchGroupClicked = (e: any) => track(ANALYZE_LOGGING_FACETTEDSEARCH_GROUP_CLICKED, e);
export const facettedSearchItemClicked = (e: any) => track(ANALYZE_LOGGING_FACETTEDSEARCH_ITEM_CLICKED, e);
export const jumpToLogs = (e: any) => track(ANALYZE_LOGGING_JUMP_TO_LOGS, e);
export const timeSpent = (e: any) => track(ANALYZE_LOGGING_TIME_SPENT, e);
