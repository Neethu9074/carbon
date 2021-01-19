/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Map } from 'immutable';

import metricDefinitions from 'in-forge/plugins/containerd/metricDefinitions';
import tableDefinition from 'in-forge/plugins/containerd/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/containerd/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.containerd,
  pluginName: {
    singular: 'Containerd Container',
    plural: 'Containerd Containers'
  },
  kpiDefinitions,
  metricDefinitions,
  tableDefinition,

  getContext(snapshot) {
    return Map({
      Labels: snapshot.getIn(['data', 'labels'])
    });
  }
});
