import { Map } from 'immutable';

import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.containerd,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Containerd Container',
    plural: 'Containerd Containers'
  },

  getContext(snapshot) {
    return Map({
      Labels: snapshot.getIn(['data', 'labels'])
    });
  }
});
