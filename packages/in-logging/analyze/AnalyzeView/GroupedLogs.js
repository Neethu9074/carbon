import React, { useMemo } from 'react';

import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
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
import { getTagCatalog } from 'in-logging/api/catalog';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useObservable from 'in-hooks/useObservable';
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
    getContent({ focusOnGroup }) {
      return (
        <Tooltip content="Focus on this group">
          <IconButton type="lib_actions_filter" href={focusOnGroup()} />
        </Tooltip>
      );
    }
  }
];

export default function GroupedLogs(props) {
  const {
    timeConfig,
    groupBy,
    backendQueryModel,
    onChange,
    orderBy,
    getRowHref,
    tagFilterExpression,
    onChangeAndGetAsUrl
  } = props;

  const tagCatalog = useObservable(getTagCatalog(), []);
  const iconMap = useMemo(() => createIconMap(tagCatalog), [tagCatalog]);

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
  const isLoading = progress?.loading;
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
            const groupAsFilter = getGroupTag(groupbyTag, group.label);
            return (
              <Li
                key={group.label}
                toggleContentOnRowClick
                renderNestedContent={() => (
                  <Logs
                    {...props}
                    withQueryBuilder={false}
                    backendQueryModel={addTagsToBackendModel(backendQueryModel, groupbyTag, group.label)}
                    getRowHref={log => getRowHref({ logId: log.id, groupFilter: groupAsFilter })}
                  />
                )}
              >
                <ColumnizedContent
                  columnDefinitions={columnDefinitions}
                  label={group.label}
                  icon={iconMap.get(groupbyTag)}
                  focusOnGroup={() =>
                    onChangeAndGetAsUrl({
                      tagFilterExpression: joinExpressions({
                        expressions: [tagFilterExpression, groupAsFilter]
                      }),
                      groupBy: null
                    })
                  }
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
