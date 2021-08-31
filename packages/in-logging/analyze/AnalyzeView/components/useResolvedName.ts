/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  LOG_CUSTOM_KEY_APPLICATION_IDS,
  LOG_CUSTOM_KEY_ENDPOINT_NAME,
  LOG_CUSTOM_KEY_ENDPOINT_TYPE,
  LOG_CUSTOM_KEY_MSG_PARAM,
  LOG_PROCESS_SNAPSHOT_ID,
  LOG_DOCKER_SNAPSHOT_ID,
  LOG_HOST_SNAPSHOT_ID,
  LOG_CUSTOM,
  LOG_SERVICE_NAME,
  LOG_STREAM_NAME
} from 'in-logging/queryBuilder';
// @ts-ignore
import { getSnapshot } from 'in-stores/snapshot';
import { getPluginName } from 'in-sdk/pluginName';
import { LogTag } from 'in-types';
import { t } from 'in-i18n';

type LinkResolver = (tag: LogTag) => Observable<string>;

const tagNameResolver = new Map<string, LinkResolver>([
  [LOG_SERVICE_NAME, () => just(t('in-logging:service'))],
  [LOG_STREAM_NAME, () => just(t('in-logging:stream'))],
  [LOG_CUSTOM, _t => just(getCustomKeyLabel(_t.key || ''))],
  [LOG_PROCESS_SNAPSHOT_ID, _t => resolveInfraLabel(_t.stringValue || '')],
  [LOG_DOCKER_SNAPSHOT_ID, _t => resolveInfraLabel(_t.stringValue || '')],
  [LOG_HOST_SNAPSHOT_ID, _t => resolveInfraLabel(_t.stringValue || '')]
]);

function getCustomKeyLabel(key: string): string {
  if (key === LOG_CUSTOM_KEY_APPLICATION_IDS) {
    return t('in-logging:applications');
  } else if (key === LOG_CUSTOM_KEY_ENDPOINT_NAME) {
    return t('in-logging:endpoint');
  } else if (key === LOG_CUSTOM_KEY_ENDPOINT_TYPE) {
    return t('in-logging:endpointType');
  } else if (key.startsWith(LOG_CUSTOM_KEY_MSG_PARAM)) {
    return t('in-logging:messageParam');
  }
  return `${LOG_CUSTOM}-key`;
}

function resolveInfraLabel(snapshotId: string) {
  return getSnapshot(snapshotId).map((snapshot: any) => getPluginName(snapshot.get('plugin'), 1));
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

  return useObservable(observable, [tagName], { resetStateOnObservableChange: true }) || tagLabel || tagName;
}
