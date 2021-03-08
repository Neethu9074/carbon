/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/googleCloudRunServiceRevision/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudRunServiceRevision/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.googleCloudRunServiceRevision,

  metricDefinitions,
  kpiDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.googleCloudRunServiceRevision.googleCloudRun')
  }
});
