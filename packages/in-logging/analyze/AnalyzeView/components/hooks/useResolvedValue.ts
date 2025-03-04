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
  LOG_CUSTOM_KEY_APPLICATION_IDS,
  LOG_RETENTION_TIME
} from 'in-logging/queryBuilder';
import { timestampToLocaleDate } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import getApplication from 'in-applications/subscriptions/getApplication';
// @ts-expect-error
import { getLabel } from 'in-sdk/snapshot';
import { Application, LogTag, Result } from 'in-types';
import { getSnapshot } from 'in-stores/snapshot';
import { t } from 'in-i18n';

type LinkResolver = (tag: LogTag) => Observable<string>;

//Array to identify if the incoming value is an string or a double(long).
export const longValues = [LOG_RETENTION_TIME];

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
  const value = !longValues.includes(uniqueTagName)
    ? tag.stringValue || ''
    : timestampToLocaleDate(tag.longValue || 0) || '';
  const resolver = tagValueResolver.get(uniqueTagName);
  return (
    useObservable(resolver ? resolver(tag) : just(value), [tag.name], {
      resetStateOnObservableChange: true
    }) ?? value
  );
}
