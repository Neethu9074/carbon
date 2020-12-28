import React, { useEffect, useState } from 'react';
import { empty } from '@instana/observables';
import classNames from 'classnames';

import FacetedSearch from 'in-applications/analyze/components/FacetedSearch/FacetedSearch';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import ResultHeader from 'in-new-components/AnalyzeView/ResultHeader';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { formatDateTime } from 'in-services/formatters/date';
import { Link } from 'in-components/tables/sharedComponents';
import { latencyFixed } from 'in-services/formatters/number';
import HealthDot from 'in-new-components/health/HealthDot';
import { emptyObject } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import SvgIcon from 'in-components/SvgIcon';

import locals from './List.mless';

const defaultOrder = 'timestamp';
const defaultDirection = 'DESC';

export default function List({
  retrievalSize = 20,
  numSkeletonRows = 3,
  tagFilterExpression,
  filterBy,
  orderBy,
  onChangeOrderBy,
  withoutPadding = false,
  isValid,
  updateFilter,
  tableOnly = false,
  hiddenCalls,
  onChangeHiddenCalls,
  dataSource,
  getNestedUngroupedData,
  linkFormModel
}) {
  // Store the last valid result so that we can show it, in case the tagFilterExpression won't be valid.
  const [{ lastDataSource, lastValidResult }, setLastState] = useState(emptyObject);
  const timeConfig = useTimeConfig();
  const order = {
    by: orderBy.by || defaultOrder,
    direction: orderBy.direction || defaultDirection
  };
  const result = useCursorPagination(
    ({ cursor }) =>
      isValid
        ? getNestedUngroupedData({
            timeConfig,
            retrievalSize,
            tagFilterExpression,
            order,
            cursor,
            hiddenCalls,
            dataSource
          })
        : empty,
    [timeConfig, retrievalSize, tagFilterExpression, orderBy, isValid, hiddenCalls, dataSource]
  );

  const resultToDisplay = !isValid && lastValidResult && lastDataSource === dataSource ? lastValidResult : result;
  const { items, ...tableProps } = resultToDisplay;

  useEffect(() => {
    if (isValid) {
      setLastState({ lastDataSource: dataSource, lastValidResult: result });
    } else if (lastDataSource !== dataSource) {
      // the last result shouldn't be cached for a different data source
      setLastState(emptyObject);
    }
  }, [result?.progress.loading, isValid, dataSource, lastDataSource]);

  const columnDefinitions = getColumnDefinitions(dataSource, linkFormModel);

  const optionalColumns = () => columnDefinitions.filter(columnDefinition => columnDefinition.optional);

  return tableOnly ? (
    <TableOnlyPresenter
      items={items}
      columnDefinitions={columnDefinitions}
      withoutPadding={withoutPadding}
      optionalColumns={optionalColumns}
      numSkeletonRows={numSkeletonRows}
      onChangeOrderBy={onChangeOrderBy}
      tableProps={tableProps}
      order={order}
      retrievalSize={retrievalSize}
      filterBy={filterBy}
    />
  ) : (
    <Presenter
      items={items}
      tagFilterExpression={tagFilterExpression}
      updateFilter={updateFilter}
      columnDefinitions={columnDefinitions}
      optionalColumns={optionalColumns}
      numSkeletonRows={numSkeletonRows}
      onChangeOrderBy={onChangeOrderBy}
      tableProps={tableProps}
      order={order}
      retrievalSize={retrievalSize}
      filterBy={filterBy}
      hiddenCalls={hiddenCalls}
      onChangeHiddenCalls={onChangeHiddenCalls}
      isValid={isValid}
      dataSource={dataSource}
    />
  );
}

function Presenter({
  items,
  tagFilterExpression,
  updateFilter,
  columnDefinitions,
  optionalColumns,
  numSkeletonRows,
  onChangeOrderBy,
  tableProps,
  order,
  retrievalSize,
  filterBy,
  hiddenCalls,
  onChangeHiddenCalls,
  isValid,
  dataSource
}) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.hitsAndFacetedSearch}>
        <ResultHeader
          itemName={dataSourceConstants[dataSource].metricLabel}
          totalRepresentedItemCount={tableProps?.totalHits}
          adjustedWindowSize={tableProps?.adjustedWindowSize}
          withSamplingTooltip
        />
        <FacetedSearch
          tagFilterExpression={tagFilterExpression}
          updateFilter={updateFilter}
          hiddenCalls={hiddenCalls}
          onChangeHiddenCalls={onChangeHiddenCalls}
          isValid={isValid}
          dataSource={dataSource}
        />
      </div>
      <div className={locals.table}>
        <CursorPaginatedTable
          columnDefinitions={columnDefinitions}
          optionalColumns={optionalColumns}
          numSkeletonRows={numSkeletonRows}
          onChange={onChangeOrderBy}
          {...tableProps}
          items={items}
          fixedLayout
          orderBy={order.by}
          orderDirection={order.direction}
          loadMoreLabel={`Load ${retrievalSize} more`}
          filterBy={filterBy}
          renderNoDataAvailable={noDataMessage => (
            <NoDataAvailable className={locals.noData} text={noDataMessage} height={80} />
          )}
        />
      </div>
    </div>
  );
}

function TableOnlyPresenter({
  items,
  columnDefinitions,
  optionalColumns,
  numSkeletonRows,
  onChangeOrderBy,
  tableProps,
  order,
  retrievalSize,
  withoutPadding,
  filterBy
}) {
  return (
    <div
      className={classNames({
        [locals.table]: true,
        [locals.tableWithoutPadding]: withoutPadding
      })}
    >
      <CursorPaginatedTable
        columnDefinitions={columnDefinitions}
        optionalColumns={optionalColumns}
        numSkeletonRows={numSkeletonRows}
        onChange={onChangeOrderBy}
        {...tableProps}
        items={items}
        fixedLayout
        orderBy={order.by}
        orderDirection={order.direction}
        loadMoreLabel={`Load ${retrievalSize} more`}
        filterBy={filterBy}
      />
    </div>
  );
}

const getColumnDefinitions = (dataSource, linkFormModel) => {
  const type = dataSourceConstants[dataSource].type;
  const name = dataSourceConstants[dataSource].metricLabel;
  return [
    {
      id: 'erroneous',
      label: (
        <div
          style={{
            width: 10,
            height: 10
          }}
          className={locals.dot}
        />
      ),
      sortable: false,
      getContent(item) {
        const severity = item[type].errorCount;
        return (
          <div className={locals.erroneous}>
            <HealthDot severity={severity} iconSize={10} />
          </div>
        );
      },
      widthInAbsoluteUnit: true,
      width: '3rem'
    },
    {
      id: `${type}_icon`,
      label: '',
      sortable: false,
      getContent() {
        return <SvgIcon type={`lib_application_${type}`} />;
      },
      widthInAbsoluteUnit: true,
      width: '3rem'
    },
    {
      id: type,
      label: name,
      sortable: false,
      ellipsis: true,
      getContent(item) {
        return (
          <Link
            href$={getLinkToTraceDetail(dataSource === 'traces' ? item[type].id : item[type].traceId, {
              [type + 'Id']: item[type].id,
              tagFilterExpression: linkFormModel
            })}
            onClick={() => dataSourceConstants[dataSource].clickedTracker()}
          >
            {item[type].label}
            {dataSource !== 'traces' && (
              <BatchingIndicator
                batchCount={item[type].batchCount}
                tooltipContent={`This ${type} is batched and represents ${item[type].batchCount} individual ${type}s.`}
              />
            )}
          </Link>
        );
      }
    },
    {
      id: 'service',
      label: 'Service',
      sortable: false,
      getContent(item) {
        return (
          <TableLinkWithIcon href$={getServiceDashboard(item[type].service.id)}>
            {item[type].service.label}
          </TableLinkWithIcon>
        );
      },
      width: '25'
    },
    {
      id: 'timestamp',
      label: 'Timestamp',
      getContent(item) {
        return formatDateTime(item[type][dataSource === 'traces' ? 'startTime' : 'started']);
      },
      widthInAbsoluteUnit: true,
      width: '11rem'
    },
    {
      id: 'latency',
      label: 'Latency',
      getContent(item) {
        return (
          <>
            {latencyFixed.compact(item[type].duration)}
            {dataSource !== 'traces' && (
              <BatchingIndicator
                batchCount={item[type].batchCount}
                tooltipContent={`Total latency of ${item[type].batchCount} batched ${type}s.`}
              />
            )}
          </>
        );
      },
      widthInAbsoluteUnit: true,
      width: '7rem'
    }
  ];
};
