import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {getCodeView} from 'in-forge/codeView/node';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.nodejs,
  icon,
  pluginName: {
    singular: 'Node.js Runtime',
    plural: 'Node.js Runtimes'
  },

  namesForTypeSearch: ['node', 'node.js', 'nodejs'],

  getLabel(s) {
    const data = s.get('data');
    const nodeJsVersion = data.getIn(['versions', 'node']);
    if (!nodeJsVersion) {
      return getFallbackLabel(s);
    }

    const label = 'Node.js v' + nodeJsVersion;

    const name = data.get('name');
    if (!name) {
      return label;
    }

    return label + ' executing ' + name;
  },

  getCodeView
});


function getFallbackLabel(s) {
  return 'Node.js#' + s.get('steadyId');
}
