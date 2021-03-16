/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/kubernetesPod/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesPod/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesPod,

  kpiDefinitions,
  metricDefinitions
});
