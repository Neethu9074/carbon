import { Map } from 'immutable';

import metricDefinitions from 'in-forge/plugins/containerd/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/containerd/kpiDefinitions';
import tableDefinition from 'in-forge/plugins/containerd/tableDefinition';
import iconSvgPath from 'in-forge/plugins/containerd/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.containerd,
  pluginName: {
    singular: 'Containerd Container',
    plural: 'Containerd Containers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  tableDefinition,

  getContext(snapshot) {
    return Map({
      Labels: snapshot.getIn(['data', 'labels'])
    });
  }
});
