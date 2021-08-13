/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { LogItem, LogTag } from 'in-types';

export interface ClickedTag {
  name: string;
  value: string;
  key?: string;
}

export type OnSelectTagHref = (tag: ClickedTag) => string;
export type GetHrefToGroupedView = (tag: any) => string;

export interface LogTagsTableProps {
  item: LogItem;
  onSelectTagHref: OnSelectTagHref;
  getHrefToGroupedView: GetHrefToGroupedView;
  tagToLabelMap: Map<string, string>;
}

export interface GetContentType extends LogTagsTableProps {
  tag: LogTag;
  uniqueTagName: string;
  isHovered: boolean;
}

export interface TagEntryProps extends LogTagsTableProps {
  tag: LogTag;
  uniqueTagName: string;
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
