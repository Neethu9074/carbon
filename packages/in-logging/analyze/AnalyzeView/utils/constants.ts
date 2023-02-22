/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { facetedSearchItems } from 'in-logging/analyze/AnalyzeView/utils/facetedSearchItems';
import { defaultChartedMetrics } from 'in-logging/analyze/AnalyzeView/utils/index';
import theme from 'in-themes';

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
export const logPillColorMap = new Map<string, string>([
  ['error', theme.lib.colors.red800],
  ['warn', theme.lib.colors.yellow800],
  ['info', theme.lib.colors.lightBlue800]
]);
