/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';

const registry = {};

export function registerKpiDefinition(plugin, kpiDefinitions) {
  registry[plugin] = kpiDefinitions;
}

export function getKpiDefinitions(plugin) {
  ensureInfraPluginsAreEvaluated();
  const kpiDefinitions = registry[plugin];

  if (kpiDefinitions) {
    return kpiDefinitions;
  }

  return [];
}
