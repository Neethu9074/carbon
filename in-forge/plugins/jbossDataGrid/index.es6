import iconPath from 'in-forge/plugins/jbossDataGrid/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {emptyMap} from 'in-services/fixedImmutables';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


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

addIconToRegistry({
  id: plugins.jbossdatagrid,
  image: iconPath
});

addSearchableEntityType('jdg', plugins.jbossdatagrid);
addSearchableEntityType('jbdg', plugins.jbossdatagrid);
