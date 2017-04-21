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
import {
  type as stringType,
  validate as validateStringColumn,
  initialize as initializeStringColumn
} from 'in-components/Table/renderers/string';
import {
  type as numberType,
  validate as validateNumberColumn,
  initialize as initializeNumberColumn
} from 'in-components/Table/renderers/number';
import {
  type as snapshotLinkType,
  validate as validateSnapshotLinkColumn,
  initialize as initializeSnapshotLinkColumn
} from 'in-components/Table/renderers/snapshotLink';

export const renderers = {
  [healthColumnType]: { validate: validateHealthColumn, initialize: initializeHealthColumn },
  [sparkChartType]: { validate: validateSparkChartColumn, initialize: initializeSparkChartColumn },
  [metricType]: { validate: validateMetricColumn, initialize: initializeMetricColumn },
  [stringType]: { validate: validateStringColumn, initialize: initializeStringColumn },
  [numberType]: { validate: validateNumberColumn, initialize: initializeNumberColumn },
  [snapshotLinkType]: { validate: validateSnapshotLinkColumn, initialize: initializeSnapshotLinkColumn }
};
