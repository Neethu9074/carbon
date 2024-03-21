/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  containerSnapshotIds,
  ID_HOST,
  ID_PROCESS,
  LOG_CUSTOM,
  LOG_CUSTOM_KEY_APPLICATION_ID,
  LOG_CUSTOM_KEY_APPLICATION_IDS
} from 'in-logging/queryBuilder';
import getApplication from 'in-applications/subscriptions/getApplication';
// @ts-ignore
import { getLabel } from 'in-sdk/snapshot';
import { Application, LogTag, Result } from 'in-types';
import { getSnapshot } from 'in-stores/snapshot';
import { t } from 'in-i18n';

type LinkResolver = (tag: LogTag) => Observable<string>;

const containerTagResolvers: [string, LinkResolver][] = containerSnapshotIds.map(id => [
  id,
  tag => resolveInfraLabel(tag.stringValue || '')
]);

const tagValueResolver = new Map<string, LinkResolver>([
  [
    LOG_CUSTOM_KEY_APPLICATION_ID,
    tag =>
      getApplication({ id: tag.stringValue || '' }).map(
        (res: Result<Application>) => res?.data?.label || tag.stringValue || ''
      )
  ],
  [
    `${LOG_CUSTOM}-${LOG_CUSTOM_KEY_APPLICATION_IDS}`,
    tag => just(t('in-logging:applicationCounter', { count: (tag.stringValue || '').split(',').length }))
  ],
  [ID_PROCESS, tag => resolveInfraLabel(tag.stringValue || '')],
  [ID_HOST, tag => resolveInfraLabel(tag.stringValue || '')],
  ...containerTagResolvers
]);

export function resolveInfraLabel(snapshotId: string): Observable<string> {
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
