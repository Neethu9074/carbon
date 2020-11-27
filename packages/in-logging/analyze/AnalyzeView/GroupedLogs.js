import React, { useMemo } from 'react';

import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/QueryBuilderWorkspace';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Header from 'in-new-components/QueryBuilder/components/Header';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import IconButton from 'in-new-components/IconButton/IconButton';
import useCursorPagination from 'in-hooks/useCursorPagination';
import Logs from 'in-logging/analyze/AnalyzeView/Logs';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import SvgIcon from 'in-components/SvgIcon';

const columnDefinitions = [
  {
    id: 'icon',
    width: '2rem',
    getContent({ icon }) {
      return <SvgIcon type={icon} />;
    }
  },
  {
    id: 'label',
    getContent({ label }) {
      return label;
    }
  },
  {
    id: 'focus',
    width: '3rem',
    shrink: false,
    getContent({ href }) {
      return (
        <Tooltip content="Focus on this group">
          <IconButton type="lib_actions_filter" href={href} />
        </Tooltip>
      );
    }
  }
];

export default function GroupedLogs(props) {
  const timeConfig = useTimeConfig();

  const {
    groupBy,
    backendQueryModel,
    onChange,
    orderBy,
    getHrefToDetailId,
    getHrefToUngroupedView,
    filteringTagCatalog
  } = props;

  const iconMap = useMemo(() => createIconMap(filteringTagCatalog), [filteringTagCatalog]);

  const groupbyTag = groupBy.groupbyTag;

  const {
    items,
    errors,
    progress,
    canLoadMore,
    result,
    loadMore,
    totalHits,
    totalRepresentedItemCount
  } = useCursorPagination(({ cursor }) => getTableData({ timeConfig, backendQueryModel, groupbyTag, cursor }), [
    timeConfig,
    groupbyTag,
    backendQueryModel
  ]);

  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading || props.isLoading;
  const hasItems = items.length > 0;

  return (
    <QueryBuilderWorkspace {...props}>
      <Header
        hitName="Group"
        totalHits={totalHits}
        itemName="Log"
        totalRepresentedItemCount={totalRepresentedItemCount}
        order={orderBy}
        setOrder={orderBy => onChange({ orderBy })}
      />
      {hasErrors && <ErrorList errors={result.errors} />}
      {hasItems && (
        <Ul space="xsmall">
          {items.map(({ group }) => {
            return (
              <Li
                key={group.label}
                toggleContentOnRowClick
                renderNestedContent={() => (
                  <Logs
                    {...props}
                    withQueryBuilder={false}
                    backendQueryModel={addTagsToBackendModel(backendQueryModel, groupbyTag, group.label)}
                    getHrefToDetailId={detailId => getHrefToDetailId(detailId, group.label)}
                  />
                )}
              >
                <ColumnizedContent
                  columnDefinitions={columnDefinitions}
                  label={group.label}
                  icon={iconMap.get(groupbyTag)}
                  href={getHrefToUngroupedView(group.label)}
                />
              </Li>
            );
          })}
          {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
        </Ul>
      )}
      {isLoading && <LoadingList numSkeletonRows={3} />}
      {!isLoading && !hasItems && <NoDataAvailable height={240} />}
    </QueryBuilderWorkspace>
  );
}

function addTagsToBackendModel(backendQueryModel, groupbyTag, groupLabel) {
  return addTagFilters(backendQueryModel, [getGroupTag(groupbyTag, groupLabel)]);
}

function getTableData({ timeConfig, backendQueryModel, groupbyTag, cursor }) {
  return getLogGroups({
    pagination: {
      cursor,
      retrievalSize: 20
    },
    timeConfig: timeConfig,
    tagFilterExpression: backendQueryModel,
    groupBy: groupbyTag
  });
}

function getGroupTag(name, value) {
  return {
    type: TAG_FILTER_TYPE,
    operator: EQUALS,
    name,
    value
  };
}

function createIconMap(tagCatalog) {
  const icons = new Map();
  const tagTree = tagCatalog?.data?.tagTree;
  if (!tagTree) {
    return icons;
  }
  for (const child of tagTree[0].children) {
    addToMap(child, icons);
  }
  return icons;
}

function addToMap({ tagName, icon, children }, map) {
  map.set(tagName, icon);
  if (children) {
    for (const child of children) {
      addToMap(child, map);
    }
  }
}
