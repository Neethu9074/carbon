/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

// This file has too many dependencies to translate yet
// @ts-ignore
import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
// @ts-ignore
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';

import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';

import {
  LOG_TRACE_ID,
  LOG_CUSTOM,
  LOG_SERVICE_NAME,
  LOG_CUSTOM_KEY_SERVICE_ID,
  LOG_PROCESS_SNAPSHOT_ID,
  LOG_DOCKER_SNAPSHOT_ID,
  LOG_HOST_SNAPSHOT_ID,
  LOG_CUSTOM_KEY_APPLICATION_ID
} from 'in-logging/queryBuilder';
import { LogItem, LogTag } from 'in-types';

type LinkResolver = (tag: LogTag, log: LogItem) => Observable<string>;

const tagValueLinkResolver = new Map<string, LinkResolver>([
  [
    LOG_SERVICE_NAME,
    (_, l) => {
      const serviceId = getServiceId(l.tags);
      if (!serviceId) {
        return null;
      }
      return getServiceDashboard(serviceId);
    }
  ],
  [LOG_CUSTOM_KEY_APPLICATION_ID, (t, _) => getApplicationDashboard(t.stringValue)],
  [LOG_TRACE_ID, (t, _) => getLinkToTraceDetail(t.stringValue)],
  [`${LOG_CUSTOM}-${LOG_CUSTOM_KEY_SERVICE_ID}`, (t, _) => getServiceDashboard(t.stringValue)],
  [LOG_PROCESS_SNAPSHOT_ID, (t, _) => getDashboardLink(t.stringValue ?? '', { pathname: '/physical/dashboard' })],
  [LOG_DOCKER_SNAPSHOT_ID, (t, _) => getDashboardLink(t.stringValue ?? '', { pathname: '/physical/dashboard' })],
  [LOG_HOST_SNAPSHOT_ID, (t, _) => getDashboardLink(t.stringValue ?? '', { pathname: '/physical/dashboard' })]
]);

function getServiceId(tags: LogTag[]): string | null {
  return tags.find(({ name, key }) => name === LOG_CUSTOM && key === LOG_CUSTOM_KEY_SERVICE_ID)?.stringValue ?? null;
}

export default function useResolvedLink(presentedName: string, tag: LogTag, item: LogItem): string | null {
  const resolver = tagValueLinkResolver.get(presentedName);
  return (
    useObservable(resolver ? resolver(tag, item) : just(null), [presentedName], {
      resetStateOnObservableChange: true
    }) ?? null
  );
}
