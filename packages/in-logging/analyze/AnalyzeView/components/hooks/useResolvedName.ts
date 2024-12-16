/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  CONTAINERD_SNAPSHOT_ID,
  CRIO_SNAPSHOT_ID,
  DOCKER_SNAPSHOT_ID,
  GARDEN_SNAPSHOT_ID,
  ID_HOST,
  ID_PROCESS,
  LOG_CUSTOM,
  LOG_CUSTOM_KEY_APPLICATION_IDS,
  LOG_CUSTOM_KEY_ENDPOINT_NAME,
  LOG_CUSTOM_KEY_ENDPOINT_TYPE,
  LOG_CUSTOM_KEY_MSG_PARAM,
  LOG_FILE_PATH,
  LOG_RETENTION_TIME,
  LOG_KUBERNETES_CLUSTER_NAME,
  LOG_KUBERNETES_DEPLOYMENT_NAME,
  LOG_KUBERNETES_NAMESPACE_NAME,
  LOG_KUBERNETES_NODE_NAME,
  LOG_KUBERNETES_POD_NAME,
  LOG_SERVICE_NAME,
  LOG_STREAM_NAME
} from 'in-logging/queryBuilder';
import { LogTag } from 'in-types';
import { t } from 'in-i18n';

type LinkResolver = (tag: LogTag) => Observable<string>;

export const tagNameResolver = new Map<string, LinkResolver>([
  [LOG_SERVICE_NAME, () => just(t('in-logging:service'))],
  [LOG_STREAM_NAME, () => just(t('in-logging:stream'))],
  [LOG_KUBERNETES_CLUSTER_NAME, () => just(t('in-logging:cluster'))],
  [LOG_KUBERNETES_NODE_NAME, () => just(t('in-logging:node'))],
  [LOG_KUBERNETES_NAMESPACE_NAME, () => just(t('in-logging:namespace'))],
  [LOG_KUBERNETES_DEPLOYMENT_NAME, () => just(t('in-logging:deployment'))],
  [LOG_KUBERNETES_POD_NAME, () => just(t('in-logging:pod'))],
  [LOG_CUSTOM, _t => just(getCustomKeyLabel(_t.key || ''))],
  [ID_PROCESS, () => just(t('in-logging:process'))],
  [ID_HOST, () => just(t('in-logging:host'))],
  [LOG_FILE_PATH, () => just(t('in-logging:file'))],
  [LOG_RETENTION_TIME, () => just(t('in-logging:logExpiration'))],
  [CONTAINERD_SNAPSHOT_ID, () => just(t('in-logging:containerdContainer'))],
  [DOCKER_SNAPSHOT_ID, () => just(t('in-logging:dockerContainer'))],
  [CRIO_SNAPSHOT_ID, () => just(t('in-logging:crioContainer'))],
  [GARDEN_SNAPSHOT_ID, () => just(t('in-logging:gardenContainer'))]
]);

export function getCustomKeyLabel(key: string): string {
  if (key === LOG_CUSTOM_KEY_APPLICATION_IDS) {
    return t('in-logging:applications');
  } else if (key === LOG_CUSTOM_KEY_ENDPOINT_NAME) {
    return t('in-logging:endpoint');
  } else if (key === LOG_CUSTOM_KEY_ENDPOINT_TYPE) {
    return t('in-logging:endpointType');
  } else if (key.startsWith(LOG_CUSTOM_KEY_MSG_PARAM)) {
    return t('in-logging:messageParam');
  }
  return key;
}

export default function useResolvedName(tag: LogTag, tagToLabelMap: Map<string, string>): string {
  const tagName = tag.name || '';
  let observable: Observable<string>;

  const tagLabel = tagToLabelMap.get(tagName);
  const resolver = tagNameResolver.get(tagName);

  if (resolver) {
    observable = resolver(tag);
  } else if (tagLabel) {
    observable = just(tagLabel);
  } else {
    observable = just(tagName);
  }

  return (
    useObservable(observable, [tagName, tagToLabelMap], { resetStateOnObservableChange: true }) || tagLabel || tagName
  );
}
