import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.zookeeper,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'ZooKeeper',
    plural: 'ZooKeepers'
  },

  namesForTypeSearch: ['zookeeper'],

  getLabel(snapshot) {
    return 'ZooKeeper ' + snapshot.getIn(['data', 'client_port'], '');
  }
});
