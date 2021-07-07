/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudIsLoadBalancer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudIsLoadBalancer/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudIsLoadBalancer,

  technologyDescriptor: {
    label: t('in-forge:plugins.ibmCloudIsLoadBalancer.ibmCloudIsLoadBalancer')
  },
  kpiDefinitions,
  metricDefinitions
});
