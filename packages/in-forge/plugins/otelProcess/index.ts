/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';

// @ts-expect-error Module needs to be translated to TS
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/otelProcess/metricDefinitions';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.otelProcess,
  metricDefinitions,
  getContext({ snapshot }: { snapshot: SnapshotData }) {
    return Map({
      Environment: snapshot.getIn(['data', 'env'])
    });
  },
  getIconType() {
    return plugins.process;
  }
});
