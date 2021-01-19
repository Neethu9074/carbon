/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';

import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';
import { compareIgnoreCase } from 'in-services/util/string';

const registry = {};
export default registry;

export function addToRegistry({ id, label, icon }) {
  registry[id] = {
    label,
    icon
  };
}

export function getLabel(id) {
  ensureInfraPluginsAreEvaluated();
  return get(registry, [id, 'label']);
}

export function getTechnologyComboBoxItems(restrict = null) {
  ensureInfraPluginsAreEvaluated();
  return Object.keys(registry)
    .filter(key => restrict == null || restrict.indexOf(key) !== -1)
    .map(key => ({ value: key, label: registry[key].label }))
    .sort((a, b) => compareIgnoreCase(a.label, b.label));
}
