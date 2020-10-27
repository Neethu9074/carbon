import { clone } from 'lodash';

import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';
import { addToRegistry } from 'in-applications/technologyRegistry';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerKpiDefinition } from 'in-sdk/metrics/kpis';
import { registerMetricDefinition } from 'in-sdk/metrics';
import { registerIconType } from 'in-sdk/iconType';
import { addLabelFinder } from 'in-sdk/snapshot';

// maps plugin => snapshot definition
export const registry = {
  processingStatistics: {}
};

export function registerSnapshotDefinition(snapshotDefinition) {
  registry[snapshotDefinition.plugin] = snapshotDefinition;
  enrichTableDefinition(snapshotDefinition);
  registerLegacySdkHooks(snapshotDefinition);
  registerMetricDefinitions(snapshotDefinition);
  registerKpiDefinitions(snapshotDefinition);
  registerNewApplicationModelHooks(snapshotDefinition);
  registerIconTypeDef(snapshotDefinition);
}

export function getOptionalSnapshotDefinition(plugin) {
  ensureInfraPluginsAreEvaluated();
  return registry[plugin];
}

export function getSnapshotDefinition(plugin) {
  const definition = getOptionalSnapshotDefinition(plugin);
  if (!definition) {
    throw new Error(`Unknown snapshot type: ${plugin}`);
  }
  return definition;
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
    width: 64,
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
}

function registerMetricDefinitions(snapshotDefinition) {
  if (!snapshotDefinition.metricDefinitions) {
    return;
  }
  snapshotDefinition.metricDefinitions.forEach(metricDefinition =>
    registerMetricDefinition(snapshotDefinition.plugin, metricDefinition)
  );
}

function registerKpiDefinitions(snapshotDefinition) {
  if (!snapshotDefinition.kpiDefinitions) {
    return;
  }

  registerKpiDefinition(snapshotDefinition.plugin, snapshotDefinition.kpiDefinitions);
}

function registerNewApplicationModelHooks(snapshotDefinition) {
  if (!snapshotDefinition.technologyDescriptor) {
    return;
  }

  addToRegistry({
    id: snapshotDefinition.plugin,
    label: snapshotDefinition.technologyDescriptor.label
  });
}

function registerIconTypeDef(snapshotDefinition) {
  if (!snapshotDefinition.getIconType) {
    return;
  }

  registerIconType(snapshotDefinition.plugin, snapshotDefinition.getIconType);
}
