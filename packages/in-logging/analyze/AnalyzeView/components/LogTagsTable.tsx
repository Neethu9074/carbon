/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Link, Stack, Ul, Li, ColumnizedContent } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  LOG_CUSTOM_KEY_APPLICATION_IDS,
  LOG_CUSTOM_KEY_SERVICE_ID,
  LOG_SPAN_ID,
  LOG_CALL_ID,
  LOG_CUSTOM_KEY_APPLICATION_ID
} from 'in-logging/queryBuilder';
import { filterAdded, groupAdded, logMessageTagClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import useResolvedValue from 'in-logging/analyze/AnalyzeView/components/useResolvedValue';
import useResolvedLink from 'in-logging/analyze/AnalyzeView/components/useResolvedLink';
import useResolvedName from 'in-logging/analyze/AnalyzeView/components/useResolvedName';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { ClickedTag } from 'in-logging/analyze/AnalyzeView/components/types';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
// @ts-ignore
import CopyToClipboard from 'in-components/CopyToClipboard';
// @ts-ignore
import Overlay from 'in-components/overlays/Overlay';
// @ts-ignore
import Header from 'in-components/Dialog/Header';
import { hasError, isLoading } from 'in-services/util/result';
import IconButton from 'in-components/IconButton/IconButton';
import IconLink from 'in-components/IconButton/IconLink';
import { pendingResult } from 'in-services/fixedObjects';
import getLog from 'in-logging/subscriptions/getLog';
import { LogItem, LogTag } from 'in-types';
import { t } from 'in-i18n';

// @ts-ignore
import locals from './LogTagsTable.mless';

type OnSelectTagHref = (tag: ClickedTag) => string;
type GetHrefToGroupedView = (tag: any) => string;
interface LogTagsTableProps {
  item: LogItem;
  onSelectTagHref: OnSelectTagHref;
  getHrefToGroupedView: GetHrefToGroupedView;
  tagToLabelMap: Map<string, string>;
}

interface GetContentType extends LogTagsTableProps {
  tag: LogTag;
  uniqueTagName: string;
  isHovered: boolean;
}

const columnDefinitions = [
  {
    id: 'name',
    width: '15rem',
    getContent: TagName
  },
  {
    id: 'value',
    getContent: TagValue
  }
];

const restrictedTags = new Set<string>([LOG_CUSTOM_KEY_SERVICE_ID, LOG_SPAN_ID, LOG_CALL_ID]);

export default function LogTagsTable({
  item,
  tagToLabelMap,
  onSelectTagHref,
  getHrefToGroupedView
}: LogTagsTableProps) {
  const logResult = useObservable(() => getLog({ itemId: item.itemId }), [item.itemId]) ?? pendingResult;

  if (!logResult || isLoading(logResult)) {
    return <LoadingList numSkeletonRows={5} />;
  }
  if (hasError(logResult)) {
    return <ErrorList errors={logResult.errors} />;
  }

  const tags: LogTag[] = logResult.data?.tags;
  return (
    <Ul>
      {tags.filter(filterTag).map((tag, i) => {
        const uniqueTagName = tag.key ? `${tag.name}-${tag.key}` : tag.name ?? '';
        return (
          <TagEntry
            key={i}
            uniqueTagName={uniqueTagName}
            tag={tag}
            item={item}
            tagToLabelMap={tagToLabelMap}
            onSelectTagHref={onSelectTagHref}
            getHrefToGroupedView={getHrefToGroupedView}
          />
        );
      })}
    </Ul>
  );
}

interface TagEntryProps extends LogTagsTableProps {
  tag: LogTag;
  uniqueTagName: string;
}

function TagEntry({ tag, item, uniqueTagName, tagToLabelMap, onSelectTagHref, getHrefToGroupedView }: TagEntryProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Li
      className={locals.li}
      size="compact"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ColumnizedContent
        columnDefinitions={columnDefinitions}
        onSelectTagHref={onSelectTagHref}
        getHrefToGroupedView={getHrefToGroupedView}
        item={item}
        tag={tag}
        tagToLabelMap={tagToLabelMap}
        uniqueTagName={uniqueTagName}
        isHovered={isHovered}
      />
    </Li>
  );
}

function TagName({ tag, tagToLabelMap }: GetContentType) {
  return useResolvedName(tag, tagToLabelMap);
}

function TagValue({ tag, uniqueTagName, isHovered, onSelectTagHref, getHrefToGroupedView, item }: GetContentType) {
  const value = tag.stringValue || '';
  const resolvedValue = useResolvedValue(uniqueTagName, tag);

  return (
    <Stack direction="horizontal" gap="xxsmall" align="center" distribution="spaceBetween">
      <ResolvedLink tag={tag} item={item} resolvedValue={resolvedValue} uniqueTagName={uniqueTagName} />

      {isHovered && (
        <Stack direction="horizontal" gap="disabled" align="center">
          <IconLink
            iconSize={16}
            type="lib_group_by"
            href={getHrefToGroupedView({ tag: tag.name, secondLevelKey: tag.key })}
            onClick={() => trackFilterClick(tag, value)}
          />
          <IconLink
            iconSize={16}
            type="lib_actions_filter"
            href={onSelectTagHref(createTag(value, tag.name, tag.key))}
            onClick={() => trackGroupClick(resolvedValue)}
          />
          <CopyToClipboard getText={() => resolvedValue}>
            {(copyToClipboardRef: any) => <IconButton ref={copyToClipboardRef} iconSize={16} type="lib_actions_copy" />}
          </CopyToClipboard>
        </Stack>
      )}
    </Stack>
  );
}

function filterTag(tag: LogTag): boolean {
  return !restrictedTags.has(tag.name || '') && !restrictedTags.has(tag.key || '');
}

interface ResolvedLinkProps {
  uniqueTagName: string;
  resolvedValue: string;
  tag: LogTag;
  item: LogItem;
}

interface ToggleProps {
  toggle: () => void;
}

function ResolvedLink({ uniqueTagName, resolvedValue, tag, item }: ResolvedLinkProps) {
  const resolvedLink = useResolvedLink(uniqueTagName, tag, item);

  if (tag.key === LOG_CUSTOM_KEY_APPLICATION_IDS) {
    return (
      <Overlay
        content={ApplicationsList}
        props={{ applicationIds: (tag.stringValue || '').split(',') }}
        align="leftMiddle"
      >
        {({ toggle }: ToggleProps) => (
          <span className={locals.link} onClick={toggle}>
            {resolvedValue}
          </span>
        )}
      </Overlay>
    );
  }

  if (resolvedLink) {
    return (
      <Link
        className={locals.value}
        href={resolvedLink}
        onClick={() => logMessageTagClicked({ tag: { name: tag.name, value: resolvedValue, key: tag.key } })}
      >
        {resolvedValue}
      </Link>
    );
  }
  return <span className={locals.value}>{resolvedValue}</span>;
}

interface ApplicationsListProps {
  applicationIds: string[];
  item: LogItem;
}

function ApplicationsList({ applicationIds, item }: ApplicationsListProps) {
  return (
    <div className={locals.applicationListOverlay}>
      <Header title={t('in-logging:applications')} />
      <Ul className={locals.applicationList}>
        {applicationIds.map(applicationId => (
          <Application key={applicationId} applicationId={applicationId} item={item} />
        ))}
      </Ul>
    </div>
  );
}

interface ApplicationProps {
  applicationId: string;
  item: LogItem;
}

function Application({ applicationId, item }: ApplicationProps) {
  const resolvedLink =
    useResolvedLink(LOG_CUSTOM_KEY_APPLICATION_ID, { stringValue: applicationId }, item) || undefined;
  const resolvedValue = useResolvedValue(LOG_CUSTOM_KEY_APPLICATION_ID, { stringValue: applicationId });

  return (
    <Li>
      <Link
        className={locals.value}
        href={resolvedLink}
        onClick={() => logMessageTagClicked({ tag: { name: LOG_CUSTOM_KEY_APPLICATION_ID, value: resolvedValue } })}
      >
        {resolvedValue}
      </Link>
    </Li>
  );
}

function trackFilterClick(tag: LogTag, value: string) {
  filterAdded({ source: 'log message filter button', filter: createTag(value, tag.name, tag.key) });
}

function trackGroupClick(group: string) {
  groupAdded({ source: 'log message filter button', group });
}

function createTag(value: string, name?: string, key?: string): ClickedTag {
  const tag: ClickedTag = { name: name || '', value };
  if (key) {
    tag.key = key;
  }
  return tag;
}
