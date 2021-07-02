/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import metricDefinitions from 'in-forge/plugins/ibmCloudLoadBalancer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmCloudLoadBalancer/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmCloudLoadBalancer,

  technologyDescriptor: {
    label: t('in-forge:plugins.ibmCloudLoadBalancer.ibmCloudLoadBalancer')
  },
  kpiDefinitions,
  metricDefinitions
});
