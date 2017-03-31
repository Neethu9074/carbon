import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.webLogic,

  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'WebLogic Server',
    plural: 'WebLogic Servers'
  },

  namesForTypeSearch: ['weblogic'],

  getLabel(s) {
    const id = s.getIn(['data', 'name'], s.get('steadyId'));
    const port = s.getIn(['data', 'port']);
    if (port) {
      return 'WebLogic #' + id + ' @' + port;
    } else {
      return 'WebLogic #' + id;
    }
  }
});
