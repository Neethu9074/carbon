/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { formatDate } from '@instana/format-date';

import {
  CONTAINERD_ID,
  CONTAINERD_SNAPSHOT_ID,
  containerSnapshotIds,
  CRIO_ID,
  CRIO_SNAPSHOT_ID,
  DOCKER_ID,
  DOCKER_SNAPSHOT_ID,
  GARDEN_ID,
  GARDEN_SNAPSHOT_ID,
  HOST_NAME,
  ID_HOST,
  ID_PROCESS,
  kubernetesTags,
  LOG_CUSTOM,
  LOG_RETENTION_TIME,
  LOG_SERVICE_NAME,
  PROCESS_ID,
  restrictedTags
} from 'in-logging/queryBuilder';
import {
  ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED,
  ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED
} from 'in-services/tracking/eventNames';
import { ClickedTag, GroupedTags, GroupingTag } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { capitalize } from 'in-services/formatters/string';
import { LogItem, LogTag } from 'in-types';

const infraTags = [...containerSnapshotIds, ID_HOST];

/** Infrastructure entity IDs are mapped to snapshot IDs because snapshot IDs are only needed for internal use.
 * For generating filters and displaying information to users we need the actual entity IDs **/
const tagMap: Record<string, string> = {
  [DOCKER_SNAPSHOT_ID]: DOCKER_ID,
  [CRIO_SNAPSHOT_ID]: CRIO_ID,
  [CONTAINERD_SNAPSHOT_ID]: CONTAINERD_ID,
  [GARDEN_SNAPSHOT_ID]: GARDEN_ID,
  [ID_HOST]: HOST_NAME,
  [ID_PROCESS]: PROCESS_ID
};

export const groupAndSortTags = (tags: LogTag[]): GroupedTags => {
  const groupedTags: GroupedTags = {
    other: [],
    customTags: [],
    kubernetes: [],
    infrastructure: []
  };

  tags.forEach(tag => {
    if (tag.name?.includes(LOG_CUSTOM)) {
      (groupedTags.customTags as LogTag[]).push(tag);
      return;
    }
    if (tag.name?.includes('kubernetes')) {
      (groupedTags.kubernetes as LogTag[]).push(tag);
      return;
    }
    if (tag.name && infraTags.includes(tag.name)) {
      (groupedTags.infrastructure as LogTag[]).push(tag);
      return;
    } else {
      if (tag.name === LOG_RETENTION_TIME) groupedTags.other.unshift(tag);
      else {
        groupedTags.other.push(tag);
      }
      return;
    }
  });

  groupedTags.infrastructure.sort(tag => (containerSnapshotIds.includes(tag.name as string) ? 1 : -1));
  groupedTags.kubernetes?.sort(
    (tag, nextTag) => kubernetesTags.indexOf(tag.name as string) - kubernetesTags.indexOf(nextTag.name as string)
  );

  return groupedTags;
};

export function trackFilterClick(trackCTA: CtaTrackingFunction, tag: LogTag, value: string | number) {
  trackCTA(ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED, { filter: createTag(value, tag.name, tag.key) });
}

export function trackGroupClick(trackCTA: CtaTrackingFunction, group: string | number) {
  trackCTA(ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED, { source: 'log message filter button', group });
}

export function createTag(value: string | number, name?: string, key?: string): ClickedTag {
  const tag: ClickedTag = { name: name || '', value };
  if (key) {
    tag.key = key;
  }
  return tag;
}

export function createTagFilter(value: string | number, itemTags: LogTag[], name?: string, key?: string): ClickedTag {
  const alternativeTag = name && itemTags.find(item => item.name === tagMap[name]);

  if (alternativeTag) return createTag(alternativeTag.stringValue!, alternativeTag.name, alternativeTag.key);
  else return createTag(value, name, key);
}

export function createGroupingTag(name?: string, key?: string): GroupingTag {
  const tag: GroupingTag = { tag: name || '' };
  if (key) {
    tag.secondLevelKey = key;
  }
  if (name === LOG_SERVICE_NAME) {
    tag.tagEntity = 'DESTINATION';
  }
  return tag;
}

export function filterTag(tag: LogTag): boolean {
  return !restrictedTags.has(tag.name || '');
}

export const getSnapshotId = (tag: LogTag, item: LogItem) => {
  if ([...containerSnapshotIds, ID_HOST, ID_PROCESS].includes(tag.name as string)) {
    return tag.stringValue;
  } else if (tag.name?.includes('kubernetes')) {
    const k8sEntityType = tag.name.split('.')[1];
    return item.tags.find(tag => tag.name?.includes(capitalize(k8sEntityType)))?.stringValue ?? null;
  } else {
    return null;
  }
};

export function getIconBySeverity(severity: number) {
  if (severity > 0 && severity <= 5) {
    return 'lib_help_error_warning';
  } else if (severity > 5) {
    return 'lib_help_error_error_circle';
  }
  return 'lib_uncheck';
}

export const timestampToLocaleDate = (timestamp: number) => {
  const timestampDate = new Date(timestamp * 1000);
  return formatDate(timestampDate)?.toString();
};
