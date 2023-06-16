/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';

import metricDefinitions from 'in-forge/plugins/otelProcess/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/otelProcess/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.otelProcess,
  kpiDefinitions,
  metricDefinitions,
  getContext(snapshot) {
    return Map({
      Environment: snapshot.getIn(['data', 'env'])
    });
  }
});
