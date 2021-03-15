/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';

import metricDefinitions from 'in-forge/plugins/defaultEntity20/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/defaultEntity20/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.defaultEntity20,
  kpiDefinitions,
  metricDefinitions,
  chartWiggleRoom: 20000,

  getLabel(entity) {
    return get(entity, ['data', 'label'], '');
  }
});
