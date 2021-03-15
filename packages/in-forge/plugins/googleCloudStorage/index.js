/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/googleCloudStorage/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudStorage/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.googleCloudStorage,

  technologyDescriptor: {
    label: t('in-forge:plugins.googleCloudStorage.googleCloudStorage')
  },
  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name'], '');
  }
});
