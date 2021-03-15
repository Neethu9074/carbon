/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/awsElb/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsElb/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.awsElb,
  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'load_balancer_name'], '');
  },
  technologyDescriptor: {
    label: t('in-forge:pluginName_awsElb')
  }
});
