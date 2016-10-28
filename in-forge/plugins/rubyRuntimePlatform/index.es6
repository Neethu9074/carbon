import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.ruby,
  icon,
  pluginName: {
    singular: 'Ruby Runtime',
    plural: 'Ruby Runtimes'
  },

  namesForTypeSearch: ['ruby', 'rubylang'],

  getLabel(s) {
    const data = s.get('data');
    const rubyVersion = data.get('ruby_version');
    if (!rubyVersion) {
      return getFallbackLabel(s);
    }

    const label = 'Ruby v' + rubyVersion;

    const name = data.get('name');
    if (!name) {
      return label;
    }

    return label + ' executing ' + name;
  }

});

function getFallbackLabel(s) {
  return 'Ruby#' + s.get('data').get('pid');
}
