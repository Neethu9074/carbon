import tableDefinition from 'in-forge/plugins/nodeJsRuntimePlatform/tableDefinition';
import icon from 'in-forge/plugins/nodeJsRuntimePlatform/icon.svg';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {getCodeView} from 'in-forge/codeView/node';
import {plugins} from 'in-forge/constants';


registerSnapshotDefinition({
  plugin: plugins.nodejs,
  icon,
  pluginName: {
    singular: 'Node.js Application',
    plural: 'Node.js Applications'
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
