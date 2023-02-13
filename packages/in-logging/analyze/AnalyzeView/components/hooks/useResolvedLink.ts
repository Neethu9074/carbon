/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useMemo } from 'react';

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  LOG_CUSTOM,
  LOG_CUSTOM_KEY_APPLICATION_ID,
  LOG_CUSTOM_KEY_ENDPOINT_ID,
  LOG_CUSTOM_KEY_ENDPOINT_NAME,
  LOG_CUSTOM_KEY_SERVICE_ID,
  LOG_DOCKER_SNAPSHOT_ID,
  LOG_HOST_SNAPSHOT_ID,
  LOG_KUBERNETES_CLUSTER_NAME,
  LOG_KUBERNETES_DEPLOYMENT_NAME,
  LOG_KUBERNETES_NAMESPACE_NAME,
  LOG_KUBERNETES_NODE_NAME,
  LOG_KUBERNETES_POD_NAME,
  LOG_PROCESS_SNAPSHOT_ID,
  LOG_SERVICE_NAME,
  LOG_TRACE_ID
} from 'in-logging/queryBuilder';
// This file has too many dependencies to translate yet
// @ts-ignore
import { getApplicationDashboard, getEndpointDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import { getKubernetesLink } from 'in-logging/analyze/AnalyzeView/components/hooks/getKubernetesLink';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { useLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { LogItem, LogTag } from 'in-types';

type LinkResolver = (tag: LogTag, log: LogItem) => Observable<string>;

function getServiceId(tags: LogTag[]): string | null {
  return tags.find(({ name, key }) => name === LOG_CUSTOM && key === LOG_CUSTOM_KEY_SERVICE_ID)?.stringValue ?? null;
}

function findTag(tags: LogTag[], tagName: string, tagKey?: string): LogTag | undefined {
  return tags.find(tag => (tagKey ? tag.name === tagName && tag.key === tagKey : tag.name === tagName));
}

export default function useResolvedLink(presentedName: string, tag: LogTag, item: LogItem): string | null {
  const getLinkToTraceDetail = useLinkToTraceDetail();

  const tagValueLinkResolver = useMemo(
    () =>
      new Map<string, LinkResolver>([
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
        [
          `${LOG_CUSTOM}-${LOG_CUSTOM_KEY_ENDPOINT_NAME}`,
          (_: LogTag, item: LogItem) => {
            const endpointId = findTag(item.tags, LOG_CUSTOM, LOG_CUSTOM_KEY_ENDPOINT_ID)?.stringValue;
            return endpointId ? getEndpointDashboard(endpointId) : just(null);
          }
        ],
        [LOG_CUSTOM_KEY_APPLICATION_ID, (t, _) => getApplicationDashboard(t.stringValue)],
        [LOG_TRACE_ID, (t, _) => getLinkToTraceDetail(t.stringValue)],
        [`${LOG_CUSTOM}-${LOG_CUSTOM_KEY_SERVICE_ID}`, (t, _) => getServiceDashboard(t.stringValue)],
        [LOG_PROCESS_SNAPSHOT_ID, (t, _) => getDashboardLink(t.stringValue ?? '', { pathname: '/physical/dashboard' })],
        [LOG_DOCKER_SNAPSHOT_ID, (t, _) => getDashboardLink(t.stringValue ?? '', { pathname: '/physical/dashboard' })],
        [LOG_HOST_SNAPSHOT_ID, (t, _) => getDashboardLink(t.stringValue ?? '', { pathname: '/physical/dashboard' })],
        [LOG_KUBERNETES_CLUSTER_NAME, getKubernetesLink],
        [LOG_KUBERNETES_POD_NAME, getKubernetesLink],
        [LOG_KUBERNETES_NODE_NAME, getKubernetesLink],
        [LOG_KUBERNETES_NAMESPACE_NAME, getKubernetesLink],
        [LOG_KUBERNETES_DEPLOYMENT_NAME, getKubernetesLink]
      ]),
    [getLinkToTraceDetail]
  );

  const resolver = tagValueLinkResolver.get(presentedName);

  return (
    useObservable(resolver ? resolver(tag, item) : just(null), [presentedName], {
      resetStateOnObservableChange: true
    }) ?? null
  );
}
