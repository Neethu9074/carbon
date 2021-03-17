/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/ibmcloudCloudant/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmcloudCloudant/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmcloudCloudant,

  technologyDescriptor: {
    label: t('in-forge:plugins.ibmcloudCloudant.ibmCloudCloudant')
  },
  kpiDefinitions,
  metricDefinitions
});
