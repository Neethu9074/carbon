import React from 'react';

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
import useCursorPagination from 'in-hooks/useCursorPagination';
import Logs from 'in-logging/analyze/AnalyzeView/Logs';

const columnDefinitions = [
  {
    id: 'label',
    label: 'Label',
    getContent(item) {
      return item.label;
    }
  }
];

export default function GroupedLogs(props) {
  const { timeConfig, groupBy, backendQueryModel, onChange, orderBy, getRowHref } = props;
  const groupbyTag = groupBy.groupbyTag;

  const { items, errors, progress, canLoadMore, result, loadMore, totalHits } = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, backendQueryModel, groupbyTag, cursor }),
    [timeConfig, groupbyTag, backendQueryModel]
  );

  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;

  return (
    <QueryBuilderWorkspace {...props}>
      <Header totalHits={totalHits} setOrder={orderBy => onChange({ orderBy })} hitName="Group" order={orderBy} />
      {hasErrors && <ErrorList errors={result.errors} />}
      <Ul space="xsmall">
        {items.map(({ group }) => (
          <Li
            key={group.label}
            size="compact"
            toggleContentOnRowClick
            renderNestedContent={() => (
              <Logs
                {...props}
                withQueryBuilder={false}
                backendQueryModel={addTagsToBackendModel(backendQueryModel, groupbyTag, group.label)}
                getRowHref={log => getRowHref({ logId: log.id, groupFilter: getGroupTag(groupbyTag, group.label) })}
              />
            )}
          >
            <ColumnizedContent columnDefinitions={columnDefinitions} label={group.label} />
          </Li>
        ))}
        {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
      </Ul>
      {isLoading && <LoadingList numSkeletonRows={3} />}
      {!isLoading && items.length === 0 && <NoDataAvailable height={240} />}
      {!isLoading && items.length === 0 && <NoDataAvailable height={240} />}
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
      retrievalSize: 10
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
