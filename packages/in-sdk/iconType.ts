/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';

const registry = {};

export function registerIconType(plugin, getIconType) {
  registry[plugin] = getIconType;
}

export function getIconTypeCallback(plugin) {
  ensureInfraPluginsAreEvaluated();
  return registry[plugin];
}
