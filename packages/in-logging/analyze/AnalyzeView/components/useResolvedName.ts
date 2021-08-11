/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, Observable } from '@instana/observables';
import { LogTag, Result, ServiceLabel } from 'in-types';
import { useObservable } from '@instana/hooks';

// @ts-ignore
import { getSnapshot } from 'in-stores/snapshot';

import {
  LOG_PROCESS_SNAPSHOT_ID,
  LOG_DOCKER_SNAPSHOT_ID,
  LOG_HOST_SNAPSHOT_ID,
  LOG_CUSTOM,
  LOG_CUSTOM_KEY_SERVICE_ID
} from 'in-logging/queryBuilder';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import { getPluginName } from 'in-sdk/pluginName';

type LinkResolver = (tag: LogTag) => Observable<string>;

const tagNameResolver = new Map<string, LinkResolver>([
  [
    `${LOG_CUSTOM}-${LOG_CUSTOM_KEY_SERVICE_ID}`,
    t =>
      getServiceLabel({ id: t.stringValue ?? '' }).map((res: Result<ServiceLabel>) =>
        res?.data?.label ? `Service` : null
      )
  ],
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
