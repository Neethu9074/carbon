import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/cloudFoundry/iconPath';
import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.cloudFoundry,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'CloudFoundry',
    plural: 'CloudFoundry(s)'
  },

  namesForTypeSearch: ['cf', 'CloudFoundry', 'cloudfoundry'],

  getLabel(s) {
    const data = s.get('data');
    const id = data.get('id');

    if (id) {
      return `CloudFoundry - ${id}`;
    }

    return getFallbackLabel();
  }

});

function getFallbackLabel() {
  return 'CloudFoundry';
}
