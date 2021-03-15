/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/awsEc/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsEc/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.awsEc,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.awsEc.labelAWSEC')
  },
  getLabel(snapshot) {
    const clusterId = snapshot.getIn(['data', 'cache_cluster_id'], '');
    const engine = snapshot.getIn(['data', 'cache_engine'], '');

    return clusterId + ' (' + engine + ')';
  }
});
