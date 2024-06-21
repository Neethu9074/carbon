/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagFilterExpressionElementUnion } from '@instana/types';

import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';
import { SnapshotMap } from 'in-components/EntityLink';

type TagFilterGetter = (plugin: string | SnapshotMap) => TagFilterExpressionElementUnion;
const registry: Record<string, TagFilterGetter> = {};

export function registerRelatedInstancesTagFilter(plugin: string, getTagFilter: TagFilterGetter): void {
  registry[plugin] = getTagFilter;
}

export function getRelatedInstancesTagFilterCallback(plugin: string): TagFilterGetter {
  ensureInfraPluginsAreEvaluated();
  return registry[plugin];
}
