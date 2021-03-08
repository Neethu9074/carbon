/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/mongoDb/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/mongoDb/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.mongoDb,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.mongoDb.mongoDb')
  }
});
