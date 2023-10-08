/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';

// @ts-expect-error Module needs to be translated to TS
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import metricDefinitions from './metricDefinitions';
import kpiDefinitions from './kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.oTelDatabase,
  kpiDefinitions,
  metricDefinitions,
  getContext({ snapshot }: { snapshot: SnapshotData }) {
    return Map({
      Environment: snapshot.getIn(['data', 'env'])
    });
  }
});
