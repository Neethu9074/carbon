import React from 'react';

import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/QueryBuilderWorkspace';
import DateTimeSeparated from 'in-components/tables/sharedComponents/DateTimeSeparated';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import LogContentColumn from 'in-logging/analyze/AnalyzeView/LogContentColumn';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Header from 'in-new-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import getLogs from 'in-logging/subscriptions/getLogs';

const columnDefinitions = [
  {
    id: 'timestamp',
    label: 'Time',
    width: '6rem',
    widthInAbsoluteUnit: true,
    getContent(item) {
      return <DateTimeSeparated>{item.log.timestamp}</DateTimeSeparated>;
    }
  },
  {
    id: 'log',
    label: 'Log',
    sortable: false,
    getContent(item) {
      return <LogContentColumn content={item.log.strippedContent} tags={item.log.tags} />;
    }
  }
];

export default function Logs(props) {
  const { orderBy, timeConfig, getRowHref, onChange, backendQueryModel, withQueryBuilder = true } = props;

  const { items, errors, progress, canLoadMore, result, loadMore, totalHits } = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, backendQueryModel, orderBy, cursor }),
    [timeConfig, orderBy.by, orderBy.direction, backendQueryModel]
  );

  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;
  const hasItems = items.length > 0;

  const list = (
    <>
      {hasErrors && <ErrorList errors={result.errors} />}
      {hasItems && (
        <Ul space="disabled">
          {items.map(item => (
            <Li key={item.log.id} size="compact" href={getRowHref(item.log)}>
              <ColumnizedContent columnDefinitions={columnDefinitions} log={item.log} />
            </Li>
          ))}
          {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
        </Ul>
      )}
      {isLoading && <LoadingList numSkeletonRows={3} />}
      {!isLoading && !hasItems && <NoDataAvailable height={240} />}
    </>
  );

  if (!withQueryBuilder) {
    return list;
  }
  return (
    <QueryBuilderWorkspace {...props}>
      <Header
        sortOptions={[
          {
            value: 'timestamp',
            label: 'Time'
          }
        ]}
        topText="no grouping"
        itemName="Log"
        totalRepresentedItemCount={totalHits ?? 0}
        order={orderBy}
        setOrder={orderBy => onChange({ orderBy })}
      />
      {list}
    </QueryBuilderWorkspace>
  );
}

function getTableData({ timeConfig, backendQueryModel, orderBy, cursor }) {
  return getLogs({
    pagination: {
      cursor,
      retrievalSize: 20
    },
    order: orderBy,
    timeConfig: timeConfig,
    tagFilterExpression: backendQueryModel
  });
}
