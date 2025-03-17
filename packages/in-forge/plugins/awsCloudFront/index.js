/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import metricDefinitions from 'in-forge/plugins/awsCloudFront/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.awsCloudFront,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'distribution_domain_name'], '');
  },
  technologyDescriptor: {
    label: t('in-forge:pluginName_awsCloudFront')
  }
});
