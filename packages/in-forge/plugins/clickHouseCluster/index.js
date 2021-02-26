/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import metricDefinitions from 'in-forge/plugins/clickHouseCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/clickHouseCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.clickHouseCluster,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.clickhouseCluster.indexLabel')
  }
});
