/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/ibmcloudFunctions/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmcloudFunctions/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmcloudFunctions,

  technologyDescriptor: {
    label: t('in-forge:plugins.ibmcloudFunctions.ibmCloudFunctions')
  },
  kpiDefinitions,
  metricDefinitions
});
