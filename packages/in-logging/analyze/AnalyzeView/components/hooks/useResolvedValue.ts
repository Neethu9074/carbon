/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  LOG_PROCESS_SNAPSHOT_ID,
  LOG_DOCKER_SNAPSHOT_ID,
  LOG_HOST_SNAPSHOT_ID,
  LOG_CUSTOM_KEY_APPLICATION_ID,
  LOG_CUSTOM,
  LOG_CUSTOM_KEY_APPLICATION_IDS
} from 'in-logging/queryBuilder';
import getApplication from 'in-applications/subscriptions/getApplication';
// @ts-ignore
import { getSnapshot } from 'in-stores/snapshot';
// @ts-ignore
import { getLabel } from 'in-sdk/snapshot';
import { Application, LogTag, Result } from 'in-types';
import { t } from 'in-i18n';

type LinkResolver = (tag: LogTag) => Observable<string>;

const tagValueResolver = new Map<string, LinkResolver>([
  [
    LOG_CUSTOM_KEY_APPLICATION_ID,
    tag =>
      getApplication({ id: tag.stringValue || '' }).map(
        (res: Result<Application>) => res?.data?.label || tag.stringValue
      )
  ],
  [
    `${LOG_CUSTOM}-${LOG_CUSTOM_KEY_APPLICATION_IDS}`,
    tag => just(t('in-logging:applicationCounter', { count: (tag.stringValue || '').split(',').length }))
  ],
  [LOG_PROCESS_SNAPSHOT_ID, tag => resolveInfraLabel(tag.stringValue || '')],
  [LOG_DOCKER_SNAPSHOT_ID, tag => resolveInfraLabel(tag.stringValue || '')],
  [LOG_HOST_SNAPSHOT_ID, tag => resolveInfraLabel(tag.stringValue || '')]
]);

function resolveInfraLabel(snapshotId: string) {
  return getSnapshot(snapshotId).map(getLabel);
}

export default function useResolvedValue(uniqueTagName: string, tag: LogTag): string {
  const value = tag.stringValue || '';
  const resolver = tagValueResolver.get(uniqueTagName);
  return (
    useObservable(resolver ? resolver(tag) : just(value), [tag.name], {
      resetStateOnObservableChange: true
    }) ?? value
  );
}
