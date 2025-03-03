/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';

// @ts-expect-error Module needs to be translated to TS
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.oTelJvm,
  metricDefinitions,
  getContext({ snapshot }: { snapshot: SnapshotData }) {
    return Map({
      Environment: snapshot.getIn(['data', 'env'])
    });
  },
  getIconType: () => 'jvmRuntimePlatform'
});
