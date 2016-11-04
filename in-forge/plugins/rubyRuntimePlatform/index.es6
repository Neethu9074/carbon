import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.ruby,
  icon,
  metricDefinitions,
  pluginName: {
    singular: 'Ruby App',
    plural: 'Ruby Apps'
  },

  namesForTypeSearch: ['ruby', 'rubylang'],

  getLabel(s) {
    const data = s.get('data');
    const name = data.get('name');
    if (name) {
      return name;
    }

    const rubyVersion = data.get('ruby_version');
    if (!rubyVersion) {
      return getFallbackLabel(s);
    }

    return 'Ruby v' + rubyVersion;
  }

});

function getFallbackLabel(s) {
  return 'Ruby#' + s.get('data').get('pid');
}
