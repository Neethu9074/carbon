import tableDefinition from 'in-forge/plugins/nodeJsRuntimePlatform/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { getCodeView } from 'in-forge/codeView/node';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.nodejs,

  iconSvgPath,
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
