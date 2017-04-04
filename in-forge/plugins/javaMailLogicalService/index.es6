import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.javaMailLogicalService,

  iconSvgPath
});

setHumanReadablePluginName(plugins.javaMailLogicalService, 'Java Mail', 'Java Mails');

addSearchableEntityType('javaMailLogicalService', plugins.javaMailLogicalService);
addSearchableEntityType('java', plugins.javaMailLogicalService);
