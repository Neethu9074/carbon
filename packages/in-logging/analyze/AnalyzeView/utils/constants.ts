/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { facetedSearchItems } from 'in-logging/analyze/AnalyzeView/utils/facetedSearchItems';
import { defaultChartedMetrics } from 'in-logging/analyze/AnalyzeView/utils/index';
import { PillTypeColors } from 'in-logging/analyze/AnalyzeView/components/Logs/types';

export const dataSourceConfigurations = {
  logs: {
    groupedView: {
      defaultOrderBy: 'count',
      defaultOrderDirection: 'DESC'
    },
    ungroupedView: {
      defaultOrderBy: 'timestamp',
      defaultOrderDirection: 'ASC'
    },
    defaultChartedMetrics,
    facetedSearchItems,
    defaultSelectableFields: []
  }
} as never;

export const logPillColorMap: Record<string, PillTypeColors> = {
  error: 'red',
  warn: 'yellow',
  info: 'blue'
};
