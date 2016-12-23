import React from 'react';

import {addIconSvgPathToRegistry, addIconPathCallback} from 'in-sdk/iconRegistry';
import {setAggregation, setStatAggregation} from 'in-sdk/metrics/aggregation';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import {getHealthInfoAtFocusedMoment} from 'in-stores/events';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {registerMetricDefinition} from 'in-sdk/metrics';
import {addSearchableEntityType} from 'in-sdk/search';
import {addLabelFinder} from 'in-sdk/snapshot';


// maps plugin => snapshot defintion
export const registry = {};


export function registerSnapshotDefinition(snapshotDefinition) {
  registry[snapshotDefinition.plugin] = snapshotDefinition;
  enrichTableDefinition(snapshotDefinition);
  registerLegacySdkHooks(snapshotDefinition);
  registerSearchHooks(snapshotDefinition);
  registerMetricDefinitions(snapshotDefinition);
  registerIconPath(snapshotDefinition);
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

  if (snapshotDefinition.metricAggregations) {
    Object.keys(snapshotDefinition.metricAggregations).forEach(metric => {
      const aggregation = snapshotDefinition.metricAggregations[metric];

      if (aggregation === 'stats') {
        setStatAggregation(metric);
      } else {
        setAggregation(metric, aggregation);
      }
    });
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

function registerIconPath(snapshotDefinition) {
  if (snapshotDefinition.getIconPath) {
    addIconPathCallback(snapshotDefinition.plugin, snapshotDefinition.getIconPath);
  }

  let iconPath;
  let icons = snapshotDefinition.icons;
  if (snapshotDefinition.iconSvgPath) {
    iconPath = snapshotDefinition.iconSvgPath;
  }
  if (icons) {
    Object.keys(icons).forEach(plugin => {
      addIconSvgPathToRegistry(plugin, icons[plugin]);
    });
  }
  if (iconPath) {
    addIconSvgPathToRegistry(snapshotDefinition.plugin, iconPath);
  }
}
