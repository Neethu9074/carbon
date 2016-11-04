import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.varnish,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Varnish Node',
    plural: 'Varnish Nodes'
  },
  namesForTypeSearch: ['varnish'],

  getLabel(snapshot) {
    return 'Varnish @' + snapshot.getIn(['data', 'port']);
  }
});
