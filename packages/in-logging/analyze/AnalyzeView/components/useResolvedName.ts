/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { LogTag } from 'in-types';

// @ts-ignore
import { getSnapshot } from 'in-stores/snapshot';

import { LOG_PROCESS_SNAPSHOT_ID, LOG_DOCKER_SNAPSHOT_ID, LOG_HOST_SNAPSHOT_ID } from 'in-logging/queryBuilder';
import { getPluginName } from 'in-sdk/pluginName';

type LinkResolver = (tag: LogTag) => Observable<string>;

const tagNameResolver = new Map<string, LinkResolver>([
  [LOG_PROCESS_SNAPSHOT_ID, t => resolveInfraLabel(t.stringValue ?? '')],
  [LOG_DOCKER_SNAPSHOT_ID, t => resolveInfraLabel(t.stringValue ?? '')],
  [LOG_HOST_SNAPSHOT_ID, t => resolveInfraLabel(t.stringValue ?? '')]
]);

function resolveInfraLabel(snapshotId: string) {
  return getSnapshot(snapshotId).map((snapshot: any) => getPluginName(snapshot.get('plugin'), 1));
}

export default function useResolvedValue(uniqueTagName: string, tag: LogTag): string {
  const resolver = tagNameResolver.get(uniqueTagName);
  return (
    useObservable(resolver ? resolver(tag) : just(uniqueTagName), [tag.name], {
      resetStateOnObservableChange: true
    }) ?? uniqueTagName
  );
}
