/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/clickHouseDatabase/metricDefinitions';
import tableDefinition from 'in-forge/plugins/clickHouseDatabase/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/clickHouseDatabase/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.clickHouseDatabase,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.clickhouseDatabase.indexLabel')
  },
  tableDefinition
});
