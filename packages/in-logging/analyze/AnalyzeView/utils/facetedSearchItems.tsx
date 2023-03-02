/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { t } from '@instana/i18n-react';

import FacetedFilterRenderer from 'in-logging/analyze/AnalyzeView/FacetedFilterRenderer';
import { LOG_LEVEL, LOG_SERVICE_NAME, LOG_STREAM_NAME } from 'in-logging/queryBuilder';
import { getLabel, getMetric } from 'in-logging/analyze/AnalyzeView/utils/index';
import { FacetedSearchItem } from 'in-components/AnalyzeView/StateManagement';

export const facetedSearchItems = [
  {
    renderer: FacetedFilterRenderer,
    title: t('in-logging:logLevels'),
    tag: LOG_LEVEL,
    getSuggestionName: getLabel,
    getMetric
  },
  {
    renderer: FacetedFilterRenderer,
    title: t('in-logging:stream'),
    tag: LOG_STREAM_NAME,
    getSuggestionName: getLabel,
    getMetric
  },
  {
    renderer: FacetedFilterRenderer,
    title: t('in-logging:service'),
    tag: LOG_SERVICE_NAME,
    getSuggestionName: getLabel,
    entity: 'DESTINATION',
    getMetric
  }
] as FacetedSearchItem[];
