/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  LOG_DOCKER_SNAPSHOT_ID,
  LOG_HOST_SNAPSHOT_ID,
  LOG_SERVICE_NAME,
  restrictedTags
} from 'in-logging/queryBuilder';
import { ClickedTag, GroupedTags, GroupingTag } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import { filterAdded, groupAdded } from 'in-logging/analyze/AnalyzeView/tracker';
import { LogTag } from 'in-types';

const infraTags = [LOG_DOCKER_SNAPSHOT_ID, LOG_HOST_SNAPSHOT_ID];

export const groupAndSortTags = (tags: LogTag[]): GroupedTags => {
  const groupedTags: GroupedTags = { other: [], kubernetes: [], infrastructure: [] };

  tags.forEach(tag => {
    if (tag.name?.includes('kubernetes')) {
      (groupedTags.kubernetes as LogTag[]).push(tag);
      return;
    }
    if (tag.name && infraTags.includes(tag.name)) {
      (groupedTags.infrastructure as LogTag[]).push(tag);
      return;
    } else {
      groupedTags.other.push(tag);
      return;
    }
  });

  groupedTags.infrastructure.sort(tag => (tag.name === LOG_DOCKER_SNAPSHOT_ID ? 1 : -1));

  return groupedTags;
};

export function trackFilterClick(tag: LogTag, value: string) {
  filterAdded({ source: 'log message filter button', filter: createTag(value, tag.name, tag.key) });
}

export function trackGroupClick(group: string) {
  groupAdded({ source: 'log message filter button', group });
}

export function createTag(value: string, name?: string, key?: string): ClickedTag {
  const tag: ClickedTag = { name: name || '', value };
  if (key) {
    tag.key = key;
  }
  return tag;
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
  return !restrictedTags.has(tag.name || '') && !restrictedTags.has(tag.key || '');
}
