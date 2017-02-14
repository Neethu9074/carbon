import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import iconSvgPath from './iconPath';


registerSnapshotDefinition({
  plugin: plugins.javaMailServiceInstance,

  iconSvgPath
});

setHumanReadablePluginName(
  plugins.javaMailServiceInstance,
  'Java Mail Instance',
  'Java Mail Instances'
);

addLabelFinder(plugins.javaMailServiceInstance, getLabel);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'name']);
}

addSearchableEntityType('javaMailServiceInstance', plugins.javaMailServiceInstance);
addSearchableEntityType('java', plugins.javaMailServiceInstance);
