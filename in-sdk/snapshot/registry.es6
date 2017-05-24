import { clone } from 'lodash';

import { setAggregation, setStatAggregation, setDynamicAggregation } from 'in-sdk/metrics/aggregation';
import { addIconSvgPathToRegistry, addIconPathCallback } from 'in-sdk/iconRegistry';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerMetricDefinition } from 'in-sdk/metrics';
import { addLabelFinder } from 'in-sdk/snapshot';

// maps plugin => snapshot defintion
export const registry = {};

export function registerSnapshotDefinition(snapshotDefinition) {
  registry[snapshotDefinition.plugin] = snapshotDefinition;
  enrichTableDefinition(snapshotDefinition);
  registerLegacySdkHooks(snapshotDefinition);
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
  snapshotDefinition.tableDefinition = clone(snapshotDefinition.tableDefinition);
  snapshotDefinition.tableDefinition.cols = snapshotDefinition.tableDefinition.cols.slice();
  snapshotDefinition.tableDefinition.cols.push({
    title: 'Health',
    type: 'health',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
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
    addLabelFinder(snapshotDefinition.plugin, snapshotDefinition.getLabel);
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

  if (snapshotDefinition.dynamicMetricAggregations) {
    Object.keys(snapshotDefinition.dynamicMetricAggregations).forEach(aggregation => {
      const metricMatcher = snapshotDefinition.dynamicMetricAggregations[aggregation];
      setDynamicAggregation(metricMatcher, aggregation);
    });
  }
}

function registerMetricDefinitions(snapshotDefinition) {
  if (!snapshotDefinition.metricDefinitions) {
    return;
  }
  snapshotDefinition.metricDefinitions.forEach(metricDefinition =>
    registerMetricDefinition(snapshotDefinition.plugin, metricDefinition)
  );
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
