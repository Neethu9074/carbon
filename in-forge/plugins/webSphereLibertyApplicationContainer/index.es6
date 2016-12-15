import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.webSphereLiberty,
  icon,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'WebSphere Liberty Server',
    plural: 'WebSphere Liberty Servers'
  },

  namesForTypeSearch: ['websphere'],

  getLabel(s) {
    const id = s.getIn(['data', 'name'], s.get('steadyId'));
    return 'WebSphere #' + id;
  }
});
