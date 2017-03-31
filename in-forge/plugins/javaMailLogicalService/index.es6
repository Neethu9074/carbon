import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.javaMailLogicalService,

  iconSvgPath
});

setHumanReadablePluginName(plugins.javaMailLogicalService, 'Java Mail', 'Java Mails');

addLabelFinder(plugins.javaMailLogicalService, getLabel);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'service_name']);
}

addSearchableEntityType('javaMailLogicalService', plugins.javaMailLogicalService);
addSearchableEntityType('java', plugins.javaMailLogicalService);
