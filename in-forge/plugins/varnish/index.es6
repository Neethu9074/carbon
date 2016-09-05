import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.varnish,
  pluginName: {
    singular: 'Varnish Node',
    plural: 'Varnish Nodes'
  },
  icon,

  namesForTypeSearch: ['varnish'],

  getLabel(snapshot) {
    return 'Varnish @' + snapshot.getIn(['data', 'port']);
  }
});
