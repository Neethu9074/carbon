/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudHPPostgreSql/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudHPPostgreSql/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudHPPostgreSql,

  technologyDescriptor: {
    label: t('in-forge:plugins.ibmCloudHPPostgreSql.ibmCloudHPPostgreSql')
  },

  kpiDefinitions,
  metricDefinitions
});
