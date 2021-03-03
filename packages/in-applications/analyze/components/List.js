/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useEffect, useState } from 'react';
import { empty } from '@instana/observables';
import classNames from 'classnames';
import Toggle from 'react-toggle';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import FacetedSearch from 'in-applications/analyze/components/FacetedSearch/FacetedSearch';
import { dataSourceConstants, getTypeTextByCount } from 'in-applications/analyze/metrics';
import QueryProgressIndicator from 'in-new-components/AnalyzeView/QueryProgressIndicator';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import CountHeader from 'in-new-components/QueryBuilder/components/Header/CountHeader';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { formatDateTime } from 'in-services/formatters/date';
import { Link } from 'in-components/tables/sharedComponents';
import { latencyFixed } from 'in-services/formatters/number';
import HealthDot from 'in-new-components/health/HealthDot';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './List.mless';

const defaultOrder = 'timestamp';
const defaultDirection = 'DESC';

export default function List({
  retrievalSize = 20,
  tagFilterExpression,
  filterBy,
  orderBy,
  onChangeOrderBy,
  withoutPadding = false,
  isValid,
  updateFilter,
  updateGroup,
  tableOnly = false,
  hiddenCalls,
  onChangeHiddenCalls,
  onChangePreviewEnabled,
  previewEnabled,
  dataSource,
  getNestedUngroupedData,
  linkFormModel
}) {
  const internalVisible = useObservable(isInternalVisible$, []) || false;
  const timeConfig = useTimeConfig();
  const order = {
    by: orderBy.by || defaultOrder,
    direction: orderBy.direction || defaultDirection
  };
  const queryPrecision = internalVisible && previewEnabled ? 'APPROXIMATE' : 'FULL';
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
            dataSource,
            queryPrecision
          })
        : empty,
    [timeConfig, retrievalSize, tagFilterExpression, orderBy, isValid, hiddenCalls, dataSource, queryPrecision]
  );

  const {
    items,
    progress,
    errors,
    canLoadMore,
    loadMore,
    totalRepresentedItemCount,
    totalHits,
    adjustedWindowSize
  } = result;

  const columnDefinitions = getColumnDefinitions(dataSource, linkFormModel);

  const optionalColumns = () => columnDefinitions.filter(columnDefinition => columnDefinition.optional);

  const [numberOfSkeletonRows, setNumberOfSkeletonRows] = useState(3);

  useEffect(() => {
    if (items?.length > 0) {
      setNumberOfSkeletonRows(items.length);
    }
  }, [items]);

  return tableOnly ? (
    <TableOnlyPresenter
      items={items}
      progress={progress}
      errors={errors}
      canLoadMore={canLoadMore}
      loadMore={loadMore}
      columnDefinitions={columnDefinitions}
      withoutPadding={withoutPadding}
      optionalColumns={optionalColumns}
      numSkeletonRows={numberOfSkeletonRows}
      onChangeOrderBy={onChangeOrderBy}
      order={order}
      retrievalSize={retrievalSize}
      filterBy={filterBy}
      isValid={isValid}
    />
  ) : (
    <Presenter
      items={items}
      progress={progress}
      errors={errors}
      canLoadMore={canLoadMore}
      loadMore={loadMore}
      totalRepresentedItemCount={totalRepresentedItemCount}
      totalHits={totalHits}
      adjustedWindowSize={adjustedWindowSize}
      tagFilterExpression={tagFilterExpression}
      updateFilter={updateFilter}
      updateGroup={updateGroup}
      columnDefinitions={columnDefinitions}
      optionalColumns={optionalColumns}
      numSkeletonRows={numberOfSkeletonRows}
      onChangeOrderBy={onChangeOrderBy}
      order={order}
      retrievalSize={retrievalSize}
      filterBy={filterBy}
      hiddenCalls={hiddenCalls}
      onChangeHiddenCalls={onChangeHiddenCalls}
      onChangePreviewEnabled={onChangePreviewEnabled}
      previewEnabled={previewEnabled}
      isValid={isValid}
      dataSource={dataSource}
    />
  );
}

function Presenter({
  items,
  progress,
  errors,
  canLoadMore,
  loadMore,
  totalRepresentedItemCount,
  totalHits,
  adjustedWindowSize,
  tagFilterExpression,
  updateFilter,
  updateGroup,
  columnDefinitions,
  optionalColumns,
  numSkeletonRows,
  onChangeOrderBy,
  order,
  retrievalSize,
  filterBy,
  hiddenCalls,
  onChangeHiddenCalls,
  onChangePreviewEnabled,
  previewEnabled,
  isValid,
  dataSource
}) {
  const internalVisible = useObservable(isInternalVisible$, []) || false;
  return (
    <div className={locals.wrapper}>
      <div className={locals.hitsAndFacetedSearch}>
        <div className={locals.hits}>
          <CountHeader
            totalRepresentedItemCount={totalRepresentedItemCount}
            totalHits={totalHits}
            withAdjustedWindowSizeTooltip={Boolean(adjustedWindowSize)}
            withSamplingTooltip
          />
        </div>
        <FacetedSearch
          tagFilterExpression={tagFilterExpression}
          updateFilter={updateFilter}
          updateGroup={updateGroup}
          hiddenCalls={hiddenCalls}
          onChangeHiddenCalls={onChangeHiddenCalls}
          isValid={isValid}
          dataSource={dataSource}
        />
      </div>
      <div className={locals.table}>
        {internalVisible && (
          <div className={locals.header}>
            <div className={locals.preview}>
              <span>{t('in-applications:analyze.groupedList.preview')}</span>
              <Toggle checked={previewEnabled} onChange={e => onChangePreviewEnabled(e.target.checked)} />
            </div>
          </div>
        )}
        {items?.length > 0 && (
          <CursorPaginatedTable
            columnDefinitions={columnDefinitions}
            optionalColumns={optionalColumns}
            numSkeletonRows={numSkeletonRows}
            onChange={onChangeOrderBy}
            progress={progress}
            errors={errors}
            canLoadMore={canLoadMore}
            loadMore={loadMore}
            items={items}
            fixedLayout
            orderBy={order.by}
            orderDirection={order.direction}
            loadMoreLabel={t('in-applications:analyze.listLoadMore', {
              retrievalSize: retrievalSize
            })}
            filterBy={filterBy}
            renderNoDataAvailable={noDataMessage => (
              <NoDataAvailable className={locals.noData} text={noDataMessage} height={80} />
            )}
          />
        )}
        {isValid && <QueryProgressIndicator progress={progress} errors={errors} items={items} />}
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
  progress,
  errors,
  canLoadMore,
  loadMore,
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
      {progress.loading === false && errors.length > 0 ? (
        <QueryProgressIndicator progress={progress} errors={errors} />
      ) : (
        <CursorPaginatedTable
          columnDefinitions={columnDefinitions}
          optionalColumns={optionalColumns}
          numSkeletonRows={numSkeletonRows}
          onChange={onChangeOrderBy}
          progress={progress}
          canLoadMore={canLoadMore}
          loadMore={loadMore}
          items={items}
          fixedLayout
          orderBy={order.by}
          orderDirection={order.direction}
          loadMoreLabel={t('in-applications:analyze.listLoadMore', {
            retrievalSize: retrievalSize
          })}
          renderNoDataAvailable={() => <NoDataAvailable className={locals.noData} icon={'lib_bar_chart'} />}
          filterBy={filterBy}
        />
      )}
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
          <Tooltip
            content={severity > 0 ? t('in-applications:analyze.containsErrors') : t('in-applications:analyze.noErrors')}
            align="rightMiddle"
          >
            <div className={locals.erroneous}>
              <HealthDot severity={severity} iconSize={10} />
            </div>
          </Tooltip>
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
                tooltipContent={t('in-applications:analyze.listBatchTypeTooltip', {
                  type: getTypeTextByCount(type, 1),
                  batchCount: item[type].batchCount,
                  types: getTypeTextByCount(type, item[type].batchCount)
                })}
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
      label: t('in-applications:labelTimestamp'),
      getContent(item) {
        return formatDateTime(item[type][dataSource === 'traces' ? 'startTime' : 'started']);
      },
      widthInAbsoluteUnit: true,
      width: '11rem'
    },
    {
      id: 'latency',
      label: t('in-applications:labelLatency'),
      getContent(item) {
        return (
          <>
            {latencyFixed.compact(item[type].duration)}
            {dataSource !== 'traces' && (
              <BatchingIndicator
                batchCount={item[type].batchCount}
                tooltipContent={t('in-applications:analyze.listBatchLatencyTooltip', {
                  batchCount: item[type].batchCount,
                  type: getTypeTextByCount(type, item[type].batchCount)
                })}
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
