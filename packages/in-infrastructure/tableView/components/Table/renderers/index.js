/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  type as healthColumnType,
  validate as validateHealthColumn,
  initialize as initializeHealthColumn
} from 'in-infrastructure/tableView/components/Table/renderers/health';
import {
  type as sparkChartType,
  validate as validateSparkChartColumn,
  initialize as initializeSparkChartColumn
} from 'in-infrastructure/tableView/components/Table/renderers/sparkChart';
import {
  type as metricType,
  validate as validateMetricColumn,
  initialize as initializeMetricColumn
} from 'in-infrastructure/tableView/components/Table/renderers/metric';
import {
  type as stringType,
  validate as validateStringColumn,
  initialize as initializeStringColumn
} from 'in-infrastructure/tableView/components/Table/renderers/string';
import {
  type as dateTimeType,
  validate as validateDateTimeColumn,
  initialize as initializeDateTimeColumn
} from 'in-infrastructure/tableView/components/Table/renderers/dateTime';
import {
  type as numberType,
  validate as validateNumberColumn,
  initialize as initializeNumberColumn
} from 'in-infrastructure/tableView/components/Table/renderers/number';
import {
  type as snapshotLinkType,
  validate as validateSnapshotLinkColumn,
  initialize as initializeSnapshotLinkColumn
} from 'in-infrastructure/tableView/components/Table/renderers/snapshotLink';
import {
  type as customType,
  validate as validateCustomColumn,
  initialize as initializeCustomColumn
} from 'in-infrastructure/tableView/components/Table/renderers/custom';
import {
  type as booleanType,
  validate as validateBooleanColumn,
  initialize as initializeBooleanColumn
} from 'in-infrastructure/tableView/components/Table/renderers/boolean';
import {
  type as linkType,
  validate as validateLinkColumn,
  initialize as initializeLinkColumn
} from 'in-infrastructure/tableView/components/Table/renderers/link';

export const renderers = {
  [healthColumnType]: { validate: validateHealthColumn, initialize: initializeHealthColumn },
  [sparkChartType]: { validate: validateSparkChartColumn, initialize: initializeSparkChartColumn },
  [metricType]: { validate: validateMetricColumn, initialize: initializeMetricColumn },
  [stringType]: { validate: validateStringColumn, initialize: initializeStringColumn },
  [dateTimeType]: { validate: validateDateTimeColumn, initialize: initializeDateTimeColumn },
  [numberType]: { validate: validateNumberColumn, initialize: initializeNumberColumn },
  [snapshotLinkType]: { validate: validateSnapshotLinkColumn, initialize: initializeSnapshotLinkColumn },
  [customType]: { validate: validateCustomColumn, initialize: initializeCustomColumn },
  [booleanType]: { validate: validateBooleanColumn, initialize: initializeBooleanColumn },
  [linkType]: { validate: validateLinkColumn, initialize: initializeLinkColumn }
};
