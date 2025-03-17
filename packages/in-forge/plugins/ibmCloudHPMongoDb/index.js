/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudHPMongoDb/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudHPMongoDb,

  technologyDescriptor: {
    label: t('in-forge:plugins.ibmCloudHPMongoDb.ibmCloudHPMongoDb')
  },

  metricDefinitions
});
