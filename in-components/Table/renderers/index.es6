import {
  type as healthColumnType,
  validate as validateHealthColumn,
  initialize as initializeHealthColumn
} from 'in-components/Table/renderers/health';
import {
  type as sparkChartType,
  validate as validateSparkChartColumn,
  initialize as initializeSparkChartColumn
} from 'in-components/Table/renderers/sparkChart';
import {
  type as metricType,
  validate as validateMetricColumn,
  initialize as initializeMetricColumn
} from 'in-components/Table/renderers/metric';

export const renderers = {
  [healthColumnType]: { validate: validateHealthColumn, initialize: initializeHealthColumn },
  [sparkChartType]: { validate: validateSparkChartColumn, initialize: initializeSparkChartColumn },
  [metricType]: { validate: validateMetricColumn, initialize: initializeMetricColumn }
};
