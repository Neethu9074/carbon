/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';

const translationTable = {};

export function setHumanReadablePluginName(plugin, singular, plural) {
  translationTable[plugin] = {
    singular,
    plural
  };
}

export function getSingular(plugin) {
  return get(plugin, 'singular');
}

export function getPlural(plugin) {
  return get(plugin, 'plural');
}

function get(plugin, prop) {
  ensureInfraPluginsAreEvaluated();
  if (!(plugin in translationTable)) {
    return plugin;
  }
  return translationTable[plugin][prop];
}
