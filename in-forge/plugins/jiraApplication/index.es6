import iconPath from 'in-forge/plugins/jiraApplication/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';

setHumanReadablePluginName(
  plugins.jira,
  'Atlassian JIRA',
  'Atlassian JIRAs'
);

addLabelFinder(
  plugins.jira,
  snapshot => 'Atlassian JIRA ' + snapshot.getIn(['data', 'version'])
);

addIconToRegistry({
  id: plugins.jira,
  image: iconPath
});

addSearchableEntityType('jira', plugins.jira);
