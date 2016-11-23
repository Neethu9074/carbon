import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.etcd,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Etcd Node',
    plural: 'Etcd Nodes'
  },
  namesForTypeSearch: ['etcd'],

  getLabel(snapshot) {
    return 'Etcd -' + snapshot.getIn(['data', 'name']);
  }
});
