import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.dropwizard,
  icon,
  supportsCodeView,
  getCodeView
});

setHumanReadablePluginName(
  plugins.dropwizard,
  'Dropwizard',
  'Dropwizard'
);

addLabelFinder(
  plugins.dropwizard,
  snapshot => snapshot.getIn(['data', 'name'], '')
);

addSearchableEntityType('dropwizard', plugins.dropwizard);
