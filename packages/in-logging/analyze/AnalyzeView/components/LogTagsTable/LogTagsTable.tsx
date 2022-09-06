/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef, useMemo, useState } from 'react';

import { ColumnizedContent, Li, Link, Stack, Ul } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { TagFilter } from '@instana/types';

import {
  LOG_CALL_ID,
  LOG_CUSTOM_KEY_APPLICATION_ID,
  LOG_CUSTOM_KEY_APPLICATION_IDS,
  LOG_CUSTOM_KEY_ENDPOINT_ID,
  LOG_CUSTOM_KEY_SERVICE_ID,
  LOG_DOCKER_SNAPSHOT_ID,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_EXCEPTION_TYPE,
  LOG_SERVICE_NAME,
  LOG_SPAN_ID
} from 'in-logging/queryBuilder';
import {
  ApplicationProps,
  ApplicationsListProps,
  ClickedTag,
  GetContentType,
  GroupingTag,
  LogTagsTableProps,
  ResolvedLinkProps,
  TagEntryProps,
  ToggleProps
} from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import ContainerPerformanceSparkcharts from 'in-logging/analyze/AnalyzeView/components/ContainerPerformanceSparkcharts';
import { filterAdded, groupAdded, logMessageTagClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import useResolvedValue from 'in-logging/analyze/AnalyzeView/components/useResolvedValue';
import useResolvedLink from 'in-logging/analyze/AnalyzeView/components/useResolvedLink';
import useResolvedName from 'in-logging/analyze/AnalyzeView/components/useResolvedName';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { getTagCatalog, logTableTags } from 'in-logging/api/catalog';
import IconButton from 'in-components/IconButton/IconButton';
import { hasError, isLoading } from 'in-services/util/result';
import CopyToClipboard from 'in-components/CopyToClipboard';
import IconLink from 'in-components/IconButton/IconLink';
import { pendingResult } from 'in-services/fixedObjects';
import Overlay from 'in-components/overlays/Overlay';
import getLog from 'in-logging/subscriptions/getLog';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Header from 'in-components/Dialog/Header';
import Tooltip from 'in-components/Tooltip';
import { LogTag } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-logging/analyze/AnalyzeView/components/LogTagsTable.mless';

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

const restrictedTags = new Set<string>([
  LOG_CUSTOM_KEY_SERVICE_ID,
  LOG_EXCEPTION_TYPE,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_CUSTOM_KEY_ENDPOINT_ID,
  LOG_SPAN_ID,
  LOG_CALL_ID
]);

interface LogTagMapperParams {
  name: string;
  label: string;
}

const LogTagsTable = forwardRef<HTMLElement, LogTagsTableProps>(function LogTagsTable(
  { item, onSelectTagHref, getHrefToGroupedView }: LogTagsTableProps,
  ref
) {
  const timeConfig = useTimeConfig();

  const internalFilteringTagCatalogResult =
    useObservable(() => getTagCatalog({ useCase: 'FILTERING', forceIncludeInternalTags: true }), [
      getTagCatalog,
      timeConfig
    ]) ?? pendingResult;

  const groupingTagCatalogResult =
    useObservable(() => getTagCatalog({ useCase: 'GROUPING', forceIncludeInternalTags: true }), [
      getTagCatalog,
      timeConfig
    ]) ?? pendingResult;

  const tagToLabelMap: Map<string, string> = useMemo(
    () =>
      new Map(
        (internalFilteringTagCatalogResult.data?.tags || []).map(({ name, label }: LogTagMapperParams) => [name, label])
      ),
    [internalFilteringTagCatalogResult]
  );

  const allowedTagsForGrouping: Set<string> = useMemo(
    () => new Set((groupingTagCatalogResult.data?.tags || []).map(({ name }: LogTagMapperParams) => name)),
    [groupingTagCatalogResult]
  );

  const logResult =
    useObservable(() => getLog({ itemId: item.itemId, requestedTags: logTableTags }), [item.itemId]) ?? pendingResult;

  if (!logResult || isLoading(logResult)) {
    return <LoadingList numSkeletonRows={5} />;
  }
  if (hasError(logResult)) {
    return <ErrorList errors={logResult.errors} />;
  }

  const tags: LogTag[] = logResult.data?.tags;

  return (
    <Ul ref={ref}>
      {tags.filter(filterTag).map((tag, i) => {
        const uniqueTagName = tag.key ? `${tag.name}-${tag.key}` : tag.name ?? '';
        return (
          <TagEntry
            key={i}
            uniqueTagName={uniqueTagName}
            tag={tag}
            item={logResult.data}
            tagToLabelMap={tagToLabelMap}
            allowedTagsForGrouping={allowedTagsForGrouping}
            onSelectTagHref={onSelectTagHref}
            getHrefToGroupedView={getHrefToGroupedView}
          />
        );
      })}
    </Ul>
  );
});

export default LogTagsTable;

function TagEntry({
  tag,
  item,
  uniqueTagName,
  tagToLabelMap,
  allowedTagsForGrouping,
  onSelectTagHref,
  getHrefToGroupedView
}: TagEntryProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isContainerTag = tag.name === LOG_DOCKER_SNAPSHOT_ID;

  return (
    <>
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
          allowedTagsForGrouping={allowedTagsForGrouping}
          uniqueTagName={uniqueTagName}
          isHovered={isHovered}
        />
      </Li>
      {isContainerTag && (
        <Li className={locals.sparkchartsLi} size="normal">
          <ContainerPerformanceSparkcharts snapshotId={tag.stringValue} />
        </Li>
      )}
    </>
  );
}

function TagName({ tag, tagToLabelMap }: TagEntryProps) {
  return useResolvedName(tag, tagToLabelMap);
}

function TagValue({
  tag,
  uniqueTagName,
  isHovered,
  allowedTagsForGrouping,
  onSelectTagHref,
  getHrefToGroupedView,
  item
}: GetContentType) {
  const value = tag.stringValue || '';
  const resolvedValue = useResolvedValue(uniqueTagName, tag);

  return (
    <Stack direction="horizontal" gap="xxsmall" align="center" distribution="spaceBetween">
      <ResolvedLink tag={tag} item={item} resolvedValue={resolvedValue} uniqueTagName={uniqueTagName} />

      {isHovered && tag.key !== LOG_CUSTOM_KEY_APPLICATION_IDS && (
        <Stack direction="horizontal" gap="disabled" align="center">
          {allowedTagsForGrouping?.has(tag.name || '') && getHrefToGroupedView && (
            <Tooltip content={t('in-logging:tooltipAddAsGroup')}>
              <IconLink
                iconSize={16}
                type="lib_group_by"
                href={getHrefToGroupedView(createGroupingTag(tag.name, tag.key))}
                onClick={() => trackGroupClick(resolvedValue)}
              />
            </Tooltip>
          )}
          {onSelectTagHref && (
            <Tooltip content={t('in-logging:tooltipAddAsFilter')}>
              <IconLink
                iconSize={16}
                type="lib_actions_filter"
                href={onSelectTagHref(createTag(value, tag.name, tag.key) as TagFilter)}
                onClick={() => trackFilterClick(tag, value)}
              />
            </Tooltip>
          )}
          <Tooltip content={t('in-logging:tooltipCopyToClipboard')}>
            <CopyToClipboard getText={() => resolvedValue}>
              {(copyToClipboardRef: any) => (
                <IconButton ref={copyToClipboardRef} iconSize={16} type="lib_actions_copy" />
              )}
            </CopyToClipboard>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
}

function filterTag(tag: LogTag): boolean {
  return !restrictedTags.has(tag.name || '') && !restrictedTags.has(tag.key || '');
}

function ResolvedLink({ uniqueTagName, resolvedValue, tag, item }: ResolvedLinkProps) {
  const resolvedLink = useResolvedLink(uniqueTagName, tag, item);

  if (tag.key === LOG_CUSTOM_KEY_APPLICATION_IDS) {
    return (
      <Overlay<ApplicationsListProps>
        content={ApplicationsList}
        props={{ applicationIds: (tag.stringValue || '').split(','), item }}
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

function createGroupingTag(name?: string, key?: string): GroupingTag {
  const tag: GroupingTag = { tag: name || '' };
  if (key) {
    tag.secondLevelKey = key;
  }
  if (name === LOG_SERVICE_NAME) {
    tag.tagEntity = 'DESTINATION';
  }
  return tag;
}
