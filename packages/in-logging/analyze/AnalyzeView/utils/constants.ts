/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { themes } from '@instana/design-tokens';

import { facetedSearchItems } from 'in-logging/analyze/AnalyzeView/utils/facetedSearchItems';
import { defaultChartedMetrics } from 'in-logging/analyze/AnalyzeView/utils/index';

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
  ['error', themes.default.ids.color.option.red['500']],
  ['warn', themes.default.ids.color.option.yellow['500']],
  ['info', themes.default.ids.color.option.blue['400']]
]);
