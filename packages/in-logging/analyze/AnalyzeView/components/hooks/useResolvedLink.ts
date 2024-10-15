/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useMemo } from 'react';

import {
  containerSnapshotIds,
  ID_HOST,
  ID_PROCESS,
  LOG_CUSTOM,
  LOG_CUSTOM_KEY_APPLICATION_ID,
  LOG_CUSTOM_KEY_ENDPOINT_ID,
  LOG_CUSTOM_KEY_ENDPOINT_NAME,
  LOG_CUSTOM_KEY_SERVICE_ID,
  LOG_FILE_PATH,
  LOG_KUBERNETES_CLUSTER_NAME,
  LOG_KUBERNETES_DEPLOYMENT_NAME,
  LOG_KUBERNETES_NAMESPACE_NAME,
  LOG_KUBERNETES_NODE_NAME,
  LOG_KUBERNETES_POD_NAME,
  LOG_SERVICE_NAME,
  LOG_TRACE_ID
} from 'in-logging/queryBuilder';
// This file has too many dependencies to translate yet
import {
  useLinkToApplicationDashboard,
  useLinkToEndpointDashboard,
  useLinkToServiceDashboard
} from 'in-applications/navigation/paths';
import { useGetKubernetesLink } from 'in-logging/analyze/AnalyzeView/components/hooks/getKubernetesLink';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { useLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { LogItem, LogTag } from 'in-types';

type LinkResolverString = (tag: LogTag, log: LogItem) => string | null;

export function getServiceId(tags: LogTag[]): string | null {
  return tags.find(({ name, key }) => name === LOG_CUSTOM && key === LOG_CUSTOM_KEY_SERVICE_ID)?.stringValue ?? null;
}

function findTag(tags: LogTag[], tagName: string, tagKey?: string): LogTag | undefined {
  return tags.find(tag => (tagKey ? tag.name === tagName && tag.key === tagKey : tag.name === tagName));
}

export default function useResolvedLink(presentedName: string, tag: LogTag | undefined, item: LogItem): string | null {
  const getLinkToTraceDetail = useLinkToTraceDetail();
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const getLinkToServiceDashboard = useLinkToServiceDashboard();
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();
  const getLinkToDashboard = useGetDashboardLink();
  const getKubernetesLink = useGetKubernetesLink();

  const containerTagResolvers: [string, LinkResolverString][] = containerSnapshotIds.map(id => [
    id,
    (t, _) => getLinkToDashboard(t.stringValue ?? '', { pathname: '/physical/dashboard' })
  ]);

  const tagValueStringLinkResolver = useMemo(
    () =>
      new Map<string, LinkResolverString>([
        [
          ID_PROCESS,
          (t, _) => getLinkToDashboard(t?.stringValue ?? '', { pathname: '/physical/dashboard' })
        ],
        [
          ID_HOST,
          (t, _) => getLinkToDashboard(t?.stringValue ?? '', { pathname: '/physical/dashboard' })
        ],
        [
          LOG_FILE_PATH,
          (t, _) => getLinkToDashboard(t?.stringValue ?? '', { pathname: '/physical/dashboard' })
        ],
        [
          LOG_TRACE_ID,
          (t, _) => getLinkToTraceDetail(t?.stringValue)
        ],
        [
          LOG_CUSTOM_KEY_APPLICATION_ID,
          (t, _) => (t?.stringValue ? getLinkToApplicationDashboard({ applicationId: t?.stringValue }) : null)
        ],
        [
          `${LOG_CUSTOM}-${LOG_CUSTOM_KEY_SERVICE_ID}`,
          (t, _) => (t?.stringValue ? getLinkToServiceDashboard({ serviceId: t?.stringValue }) : null)
        ],
        [
          LOG_SERVICE_NAME,
          (_, l) => {
            const serviceId = getServiceId(l.tags);
            return serviceId ? getLinkToServiceDashboard({ serviceId }) : null;
          }
        ],
        [
          `${LOG_CUSTOM}-${LOG_CUSTOM_KEY_ENDPOINT_NAME}`,
          (_: LogTag, item: LogItem) => {
            const endpointId = findTag(item.tags, LOG_CUSTOM, LOG_CUSTOM_KEY_ENDPOINT_ID)?.stringValue;
            return endpointId ? getLinkToEndpointDashboard({ endpointId }) : null;
          }
        ],
        [LOG_KUBERNETES_CLUSTER_NAME, getKubernetesLink],
        [LOG_KUBERNETES_POD_NAME, getKubernetesLink],
        [LOG_KUBERNETES_NODE_NAME, getKubernetesLink],
        [LOG_KUBERNETES_NAMESPACE_NAME, getKubernetesLink],
        [LOG_KUBERNETES_DEPLOYMENT_NAME, getKubernetesLink],
        ...containerTagResolvers
      ]),
    [getLinkToApplicationDashboard, getLinkToServiceDashboard, getLinkToEndpointDashboard, getLinkToTraceDetail]
  );


  const stringResolver = tagValueStringLinkResolver.get(presentedName);

  return (
    (stringResolver && tag && stringResolver(tag, item)) ??
    null
  );
}
