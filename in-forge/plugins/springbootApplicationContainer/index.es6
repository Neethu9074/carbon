import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.springboot,
  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView,
  pluginName: {
    singular: 'Spring Boot App',
    plural: 'Spring Boot Apps'
  },
  namesForTypeSearch: ['spring'],

  getLabel(snapshot) {
    const data = snapshot.get('data');
    const portsMap = data.get('ports');
    const appName = data.get('name');
    const version = data.get('version');
    let label = 'Springboot';
    if (appName) {
      label = appName;
      if (version) {
        label += ' ' + version;
      }
    }
    if (portsMap && portsMap.size > 0) {
      const ports = portsMap.valueSeq().join(', ');
      label += ' @' + ports;
    }
    return label;
  }
});
