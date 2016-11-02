import React from 'react';

import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import {addMapping as addIconMapping} from 'in-sdk/iconRegistry';
import {getHealthInfoAtFocusedMoment} from 'in-stores/events';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {registerMetricDefinition} from 'in-sdk/metrics';
import {addSearchableEntityType} from 'in-sdk/search';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addLabelFinder} from 'in-sdk/snapshot';


// maps plugin => snapshot defintion
export const registry = {};


export function registerSnapshotDefinition(snapshotDefinition) {
  registry[snapshotDefinition.plugin] = snapshotDefinition;
  enrichTableDefinition(snapshotDefinition);
  registerLegacySdkHooks(snapshotDefinition);
  registerSearchHooks(snapshotDefinition);
  registerMetricDefinitions(snapshotDefinition);
}


export function getSnapshotDefinition(plugin) {
  const defintion = registry[plugin];
  if (!defintion) {
    throw new Error(`Unknown snapshot type: ${plugin}`);
  }
  return defintion;
}


function enrichTableDefinition(snapshotDefinition) {
  if (!snapshotDefinition.tableDefinition) {
    return;
  }

  // shallow copy to allow reuse of table definitions
  snapshotDefinition.tableDefinition = snapshotDefinition.tableDefinition.slice();
  snapshotDefinition.tableDefinition.push({
    title: 'Health',
    sortableType: Number,
    defaultSortDirection: 'desc',
    style: {
      display: 'flex',
      alignItems: 'center',
      minWidth: '9.375rem',
      maxWidth: '9.375rem'
    },
    get(snapshot) {
      return {
        content: (
          <AnnotatedHealthBar snapshotId={snapshot.get('id')} />
        ),
        sortable$: getHealthInfoAtFocusedMoment(snapshot.get('id'))
          .map(healthInfo => healthInfo.get('maxSeverity'))
      };
    }
  });
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


function registerMetricDefinitions(snapshotDefinition) {
  if (!snapshotDefinition.metricDefinitions) {
    return;
  }
  snapshotDefinition.metricDefinitions
    .forEach(metricDefinition => registerMetricDefinition(snapshotDefinition.plugin, metricDefinition));
}
