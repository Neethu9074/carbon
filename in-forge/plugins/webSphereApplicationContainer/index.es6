import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.webSphere,
  icon,
  supportsCodeView,
  getCodeView
});

setHumanReadablePluginName(
  plugins.webSphere,
  'WebSphere',
  'WebSpheres'
);

addLabelFinder(
  plugins.webSphere,
  snapshot => {
    let label = 'WebSphere';
    const data = snapshot.get('data');
    const nodeName = data.get('nodeName');
    const serverName = data.get('serverName');
    if (nodeName && serverName) {
      label += ' @ ' + nodeName + ' - ' + serverName;
    }
    return label;
  }
);
