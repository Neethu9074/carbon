import {addMapping as addIconMapping} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addLabelFinder} from 'in-sdk/snapshot';


// maps plugin => snapshot defintion
export const registry = {};


export function registerSnapshotDefinition(snapshotDefinition) {
  registry[snapshotDefinition.plugin] = snapshotDefinition;
  registerLegacySdkHooks(snapshotDefinition);
  registerSearchHooks(snapshotDefinition);
}


export function getSnapshotDefinition(plugin) {
  const defintion = registry[plugin];
  if (!defintion) {
    throw new Error(`Unknown snapshot type: ${plugin}`);
  }
  return defintion;
}


function registerLegacySdkHooks(snapshotDefinition) {
  if (snapshotDefinition.icon) {
    addIconToRegistry({
      id: snapshotDefinition.plugin,
      image: snapshotDefinition.icon
    });
  }

  if (snapshotDefinition.icons) {
    Object.keys(snapshotDefinition.icons).forEach(key => {
      addIconToRegistry({
        id: key,
        image: snapshotDefinition.icons[key]
      });
    });
  }

  if (snapshotDefinition.getIcon) {
    addIconMapping(snapshotDefinition.plugin, snapshotDefinition.getIcon);
  }

  if (snapshotDefinition.pluginName) {
    setHumanReadablePluginName(
      snapshotDefinition.plugin,
      snapshotDefinition.pluginName.singular,
      snapshotDefinition.pluginName.plural
    );
  }

  if (snapshotDefinition.getLabel) {
    addLabelFinder(
      snapshotDefinition.plugin,
      snapshotDefinition.getLabel
    );
  }
}


function registerSearchHooks(snapshotDefinition) {
  if (snapshotDefinition.namesForTypeSearch) {
    snapshotDefinition.namesForTypeSearch.forEach(name => {
      addSearchableEntityType(name, snapshotDefinition.plugin);
    });
  }
}
