/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/ibmcloudLoadBalancer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmcloudLoadBalancer/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.ibmcloudLoadBalancer,

  technologyDescriptor: {
    label: t('in-forge:plugins.ibmcloudLoadBalancer.ibmCloudLoadBalancer')
  },
  kpiDefinitions,
  metricDefinitions
});
