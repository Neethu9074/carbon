/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useMemo } from 'react';

import { CarbonContainedList, CarbonContainedListItem, LoadingSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { LogTagMapperParams, LogTagsTableProps } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import { filterTag, groupAndSortTags } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/utils';
import { TagEntry, TagGroupHeader } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/Tag';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { hasError, isLoading } from 'in-services/util/result';
import { capitalize } from 'in-services/formatters/string';
import { pendingResult } from 'in-services/fixedObjects';
import { logTableTags } from 'in-logging/queryBuilder';
import { getTagCatalog } from 'in-logging/api/catalog';
import { logsPath } from 'in-logging/navigation/paths';
import getLog from 'in-logging/subscriptions/getLog';
import { useScrollIntoView } from 'in-logging/hooks';
import useTimeConfig from 'in-hooks/useTimeConfig';
import decamelize from 'in-sdk/decamelize';
import { LogTag } from 'in-types';

import locals from 'in-logging/analyze/AnalyzeView/components/LogTagsTable.mless';

const LogTagsTable = ({ item, selectedId, onSelectTagHref, getHrefToGroupedView }: LogTagsTableProps) => {
  const timeConfig = useTimeConfig();
  const { location } = useNavigation();

  const internalFilteringTagCatalogResult =
    useObservable(
      () => getTagCatalog({ useCase: 'FILTERING', forceIncludeInternalTags: true }),
      [getTagCatalog, timeConfig]
    ) ?? pendingResult;

  const groupingTagCatalogResult =
    useObservable(
      () => getTagCatalog({ useCase: 'GROUPING', forceIncludeInternalTags: true }),
      [getTagCatalog, timeConfig]
    ) ?? pendingResult;

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

  const scrollCondition = logResult.data && selectedId === item.itemId;
  const tagTableSize: 'sm' | 'md' | 'lg' | 'xl' = 'sm';

  const ref = useScrollIntoView([logResult.data], scrollCondition, () => {
    setTimeout(() => setOrDeleteMatrixKey(location, logsPath, 'selectedId', null));
  });

  if (!logResult || isLoading(logResult)) {
    return (
      <CarbonContainedList label={''} size={tagTableSize} className={locals.hideTitle}>
        {Array(5)
          .fill(1)
          .map(() => (
            <CarbonContainedListItem>
              <LoadingSkeleton className={locals.tagSkeleton} />
            </CarbonContainedListItem>
          ))}
      </CarbonContainedList>
    );
  }

  if (hasError(logResult)) {
    return <ErrorList errors={logResult.errors} />;
  }

  const tags: LogTag[] = logResult.data?.tags.filter(filterTag);

  const mapTags = (tags: LogTag[]) =>
    tags.map(tag => {
      const uniqueTagName = tag.key ? `${tag.name}-${tag.key}` : tag.name ?? '';
      if (tag.stringValue === 'null') return null;
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

  const MappedTags = Object.entries(groupAndSortTags(tags)).flatMap(([key, value]) => {
    const isTagGroup = key !== 'other' && value.length > 0;
    if (isTagGroup) {
      const groupLabel = decamelize(key)
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
      const GroupTags = mapTags(value);
      const GroupHeaderTag = <TagGroupHeader key={groupLabel} groupLabel={groupLabel} />;

      return [GroupHeaderTag, ...GroupTags];
    } else return mapTags(value);
  });

  return (
    <div data-testid="log-tag-table" ref={ref as React.RefObject<HTMLDivElement>}>
      <CarbonContainedList label="" className={locals.hideTitle} size={tagTableSize}>
        {MappedTags}
      </CarbonContainedList>
    </div>
  );
};

export default LogTagsTable;
