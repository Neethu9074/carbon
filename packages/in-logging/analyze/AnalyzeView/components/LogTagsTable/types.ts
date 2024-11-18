/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { TagFilter } from '@instana/types';

import { LogItem, LogTag } from 'in-types';

export interface ClickedTag {
  name: string;
  value: string | number;
  key?: string;
}

export interface GroupingTag {
  tag: string;
  secondLevelKey?: string;
  tagEntity?: string;
}

export type OnSelectTagHref = (tag: TagFilter) => string;
export type GetHrefToGroupedView = (tag: TagFilter | GroupingTag) => string;

export interface LogTagsTableProps {
  item: LogItem;
  selectedId?: string;
  onSelectTagHref?: OnSelectTagHref;
  getHrefToGroupedView?: GetHrefToGroupedView;
}

export interface GetContentType extends LogTagsTableProps {
  tag: LogTag;
  uniqueTagName: string;
  allowedTagsForGrouping?: Set<string>;
  resolvedValue: string;
}

export interface TagEntryProps extends LogTagsTableProps {
  tag: LogTag;
  uniqueTagName: string;
  tagToLabelMap: Map<string, string>;
  allowedTagsForGrouping?: Set<string>;
}

export interface ResolvedLinkProps {
  uniqueTagName: string;
  resolvedValue: string;
  tag: LogTag;
  item: LogItem;
}

export interface ToggleProps {
  toggle: () => void;
}

export interface ApplicationsListProps {
  applicationIds: string[];
  item: LogItem;
}

export interface ApplicationProps {
  applicationId: string;
  item: LogItem;
}

export interface TagGroupHeaderProps {
  groupLabel: string;
}

export interface LogTagMapperParams {
  name: string;
  label: string;
}

export type TagGroup = 'other' | 'infrastructure' | 'kubernetes' | 'customTags';
export type GroupedTags = Record<TagGroup, LogTag[]>;
