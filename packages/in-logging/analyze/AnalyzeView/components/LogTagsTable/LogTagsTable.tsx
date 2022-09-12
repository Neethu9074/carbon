/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef, useMemo } from 'react';

import { useObservable } from '@instana/hooks';
import { Ul } from '@instana/components';

import { LogTagMapperParams, LogTagsTableProps } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import { filterTag, groupAndSortTags } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/utils';
import { TagEntry, TagGroupHeader } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/Tag';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { LOG_DOCKER_SNAPSHOT_ID, logTableTags } from 'in-logging/queryBuilder';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { hasError, isLoading } from 'in-services/util/result';
import { capitalize } from 'in-services/formatters/string';
import { pendingResult } from 'in-services/fixedObjects';
import { getTagCatalog } from 'in-logging/api/catalog';
import getLog from 'in-logging/subscriptions/getLog';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { LogTag } from 'in-types';

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

  const tags: LogTag[] = logResult.data?.tags.filter(filterTag);

  const isDockerContainerLog = tags.some(tag => tag.name === LOG_DOCKER_SNAPSHOT_ID);

  const mapTags = (tags: LogTag[]) =>
    tags.map(tag => {
      const uniqueTagName = tag.key ? `${tag.name}-${tag.key}` : tag.name ?? '';
      return (
        <TagEntry
          key={uniqueTagName}
          uniqueTagName={uniqueTagName}
          tag={tag}
          item={logResult.data}
          tagToLabelMap={tagToLabelMap}
          allowedTagsForGrouping={allowedTagsForGrouping}
          onSelectTagHref={onSelectTagHref}
          getHrefToGroupedView={getHrefToGroupedView}
        />
      );
    });

  const MappedTags = isDockerContainerLog
    ? Object.entries(groupAndSortTags(tags)).flatMap(([key, value]) => {
        const isTagGroup = key !== 'other' && value.length > 0;
        if (isTagGroup) {
          const groupLabel = capitalize(key);
          const GroupTags = mapTags(value);
          const GroupHeaderTag = <TagGroupHeader key={groupLabel} groupLabel={groupLabel} />;

          return [GroupHeaderTag, ...GroupTags];
        } else return mapTags(value);
      })
    : mapTags(tags);

  return <Ul ref={ref}>{MappedTags}</Ul>;
});

export default LogTagsTable;
