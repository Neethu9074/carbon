import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.webSphere,

  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'WebSphere',
    plural: 'WebSpheres'
  },

  namesForTypeSearch: ['websphere'],

  getLabel(s) {
    const data = s.get('data');
    const cellName = data.get('cellName');
    const nodeName = data.get('nodeName');
    const serverName = data.get('serverName');
    if (cellName && nodeName && serverName) {
      return 'WebSphere @' + cellName + '/' + nodeName + '/' + serverName;
    }
    return getFallbackLabel(s);
  }
});

function getFallbackLabel(s) {
  return 'WebSphere #' + s.get('steadyId');
}
