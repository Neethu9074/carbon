/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import FacetedFilterRenderer from 'in-logging/analyze/AnalyzeView/FacetedFilterRenderer';
import { LOG_LEVEL, LOG_SERVICE_NAME, LOG_STREAM_NAME } from 'in-logging/queryBuilder';
import { getLabel, getMetric } from 'in-logging/analyze/AnalyzeView/utils/index';
import { FacetedSearchItem } from 'in-components/AnalyzeView/StateManagement';

export const facetedSearchItems = [
  {
    renderer: FacetedFilterRenderer,
    title: 'Log levels',
    tag: LOG_LEVEL,
    getSuggestionName: getLabel,
    getMetric
  },
  {
    renderer: FacetedFilterRenderer,
    title: 'Stream',
    tag: LOG_STREAM_NAME,
    getSuggestionName: getLabel,
    getMetric
  },
  {
    renderer: FacetedFilterRenderer,
    title: 'Service',
    tag: LOG_SERVICE_NAME,
    getSuggestionName: getLabel,
    entity: 'DESTINATION',
    getMetric
  }
] as FacetedSearchItem[];
