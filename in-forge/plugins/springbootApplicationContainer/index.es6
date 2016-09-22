import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.springboot,
  icon,
  supportsCodeView,
  getCodeView
});

setHumanReadablePluginName(
  plugins.springboot,
  'Springboot',
  'Springboot'
);

addLabelFinder(
  plugins.springboot,
  snapshot => {
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
);

addSearchableEntityType('springboot', plugins.springboot);
