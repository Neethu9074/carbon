/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { LogTag } from 'in-types';

// @ts-ignore
import { getSnapshot } from 'in-stores/snapshot';

import {
  LOG_CUSTOM_KEY_APPLICATION_IDS,
  LOG_CUSTOM_KEY_ENDPOINT_NAME,
  LOG_CUSTOM_KEY_ENDPOINT_TYPE,
  LOG_CUSTOM_KEY_MSG_PARAM,
  LOG_PROCESS_SNAPSHOT_ID,
  LOG_DOCKER_SNAPSHOT_ID,
  LOG_HOST_SNAPSHOT_ID,
  LOG_CUSTOM
} from 'in-logging/queryBuilder';
import { getPluginName } from 'in-sdk/pluginName';

type LinkResolver = (tag: LogTag) => Observable<string>;

const tagNameResolver = new Map<string, LinkResolver>([
  [LOG_CUSTOM, t => just(getCustomKeyLabel(t.key || ''))],
  [LOG_PROCESS_SNAPSHOT_ID, t => resolveInfraLabel(t.stringValue || '')],
  [LOG_DOCKER_SNAPSHOT_ID, t => resolveInfraLabel(t.stringValue || '')],
  [LOG_HOST_SNAPSHOT_ID, t => resolveInfraLabel(t.stringValue || '')]
]);

function getCustomKeyLabel(key: string): string {
  if (key === LOG_CUSTOM_KEY_APPLICATION_IDS) {
    return 'Applications';
  } else if (key === LOG_CUSTOM_KEY_ENDPOINT_NAME) {
    return 'Endpoint';
  } else if (key === LOG_CUSTOM_KEY_ENDPOINT_TYPE) {
    return 'Endpoint type';
  } else if (key.startsWith(LOG_CUSTOM_KEY_MSG_PARAM)) {
    return 'Message parameter';
  }
  return `${LOG_CUSTOM}-key`;
}

function resolveInfraLabel(snapshotId: string) {
  return getSnapshot(snapshotId).map((snapshot: any) => getPluginName(snapshot.get('plugin'), 1));
}

export default function useResolvedValue(tag: LogTag, tagToLabelMap: Map<string, string>): string {
  const tagName = tag.name || '';
  let observable: Observable<string>;

  const tagLabel = tagToLabelMap.get(tagName);
  const resolver = tagNameResolver.get(tagName);

  console.log({ tagName, tagLabel, tagToLabelMap });

  if (resolver) {
    observable = resolver(tag);
  } else if (tagLabel) {
    observable = just(tagLabel);
  } else {
    observable = just(tagName);
  }

  return useObservable(observable, [tagName], { resetStateOnObservableChange: true }) || tagLabel || tagName;
}
