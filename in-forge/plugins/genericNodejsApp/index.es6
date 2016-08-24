import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.nodejsApp,
  icon,

  pluginName: {
    singular: 'Node.js App',
    plural: 'Node.js Apps'
  },

  namesForTypeSearch: ['nodeApp', 'node.jsApp', 'nodejsApp'],

  getLabel(s) {
    const data = s.get('data');
    if (!data) {
      return getFallbackLabel(s);
    }

    const name = data.get('name');
    if (!name) {
      return getFallbackLabel(s);
    }

    let label = name;
    const version = data.get('version');
    if (version) {
      label = label + '@' + version;
    }

    return label;
  }
});

function getFallbackLabel(s) {
  return 'Node.js App#' + s.get('steadyId');
}
