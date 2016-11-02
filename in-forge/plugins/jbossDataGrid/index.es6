import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {emptyMap} from 'in-services/fixedImmutables';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.jbossdatagrid,
  icon
});


setHumanReadablePluginName(
  plugins.jbossdatagrid,
  'Jboss Data Grid',
  'Jboss Data Grids'
);

addLabelFinder(
  plugins.jbossdatagrid,
  snapshot => {
    let label = 'Jboss Data Grid';
    const ports = snapshot.getIn(['data', 'ports'], emptyMap);
    if (ports) {
      label += ' @' + ports.toList().join(', ');
    }
    return label;
  }
);

addSearchableEntityType('jdg', plugins.jbossdatagrid);
addSearchableEntityType('jbdg', plugins.jbossdatagrid);
