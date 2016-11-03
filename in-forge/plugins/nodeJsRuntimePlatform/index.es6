import tableDefinition from 'in-forge/plugins/nodeJsRuntimePlatform/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {getCodeView} from 'in-forge/codeView/node';
import {plugins} from 'in-forge/constants';

import icon from 'in-forge/plugins/nodeJsRuntimePlatform/icon.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.nodejs,
  icon,
  metricDefinitions,
  pluginName: {
    singular: 'Node.js App',
    plural: 'Node.js Apps'
  },

  tableDefinition,
  namesForTypeSearch: ['node', 'node.js', 'nodejs'],

  getLabel(s) {
    const data = s.get('data');
    const appVersion = data.get('version');
    const appName = data.get('name');

    if (appName && appVersion) {
      return `${appName} v${appVersion}`;
    } else if (appName) {
      return appName;
    }

    return getFallbackLabel();
  },

  getCodeView
});


function getFallbackLabel() {
  return 'Unknown Node.js App';
}
