/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudFoundry/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudFoundry/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudFoundry,

  technologyDescriptor: {
    label: t('in-forge:plugins.ibmCloudFoundry.ibmCloudFoundry')
  },
  kpiDefinitions,
  metricDefinitions
});
