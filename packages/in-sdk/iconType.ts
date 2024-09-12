/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getSvgIcon } from '@instana/components';

import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import { SnapshotMap } from 'in-components/EntityLink';
import { nonServicePlugins } from 'in-forge/constants';

type IconTypeGetter = (plugin: string | SnapshotMap) => string;
const registry: Record<string, IconTypeGetter> = {};

export function registerIconType(plugin: string, getIconType: IconTypeGetter): void {
  registry[plugin] = getIconType;
}

export function getIconTypeCallback(plugin: string): IconTypeGetter {
  ensureInfraPluginsAreEvaluated();
  return registry[plugin];
}

export function getRegistry() {
  ensureInfraPluginsAreEvaluated();
  return Object.values(nonServicePlugins).map(plugin => ({ id: plugin, path: getSvgIcon(getIconType(plugin))?.path }));
}
