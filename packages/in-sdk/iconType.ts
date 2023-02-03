/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';
import { SnapshotMap } from 'in-components/EntityLink';

type IconTypeGetter = (plugin: string | SnapshotMap) => string;
const registry: Record<string, IconTypeGetter> = {};

export function registerIconType(plugin: string, getIconType: IconTypeGetter): void {
  registry[plugin] = getIconType;
}

export function getIconTypeCallback(plugin: string): IconTypeGetter {
  ensureInfraPluginsAreEvaluated();
  return registry[plugin];
}
