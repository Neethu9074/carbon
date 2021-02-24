/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/application/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/application/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.application,

  kpiDefinitions,
  metricDefinitions,
  chartWiggleRoom: 20000,

  getLabel(entity) {
    return entity.get('label', 'Application');
  }
});
