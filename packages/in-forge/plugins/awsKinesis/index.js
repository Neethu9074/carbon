/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import metricDefinitions from 'in-forge/plugins/awsKinesis/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsKinesis/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsKinesis,
  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'kns_stream_name'], '');
  },
  technologyDescriptor: {
    label: t('in-forge:plugins.awsKinesis.labelAWSKinesis')
  }
});
