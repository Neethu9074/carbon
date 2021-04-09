/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find } from 'lodash';
import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow
} from 'in-components/tables/sharedComponents';
import { buildOrderByCriteria } from 'in-websites/analyze/AnalyzeView/metrics';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import SortableColumn from 'in-analyze/components/SortableColumn';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import SetBodyColor from 'in-components/SetBodyColor';
import Sticky from 'in-components/Sticky';

export default function BeaconsPresenter(props) {
  const {
    items,
    errors,
    progress,
    loadMore,
    canLoadMore,
    orderBy,
    orderDirection,
    onChangeOrder,
    beaconType,
    TableHeaderColumns,
    TableRowColumns,
    metrics,
    availableMetrics,
    perTypeColumnCount
  } = props;

  const columnCount = perTypeColumnCount + metrics.length;

  return (
    <>
      <Sticky
        header={
          <>
            <AnalyzeHeader
              renderQuickFilterBar={() => (
                <QuickFilterBar
                  showWebsiteSelector
                  showPageSelector
                  showSubdivisionSelector
                  showWindowWidthSelector
                  {...props}
                />
              )}
            />
          </>
        }
      >
        <LeftRightPadding>
          <TagFilterList {...props} />
          <GroupingTableHeader
            itemType={beaconType}
            nbItems={props.totalHits}
            {...props}
            // Graphs are not supported in un-grouped view
            onChange={null}
          />

          <Table tableInCard>
            <Thead>
              <Tr size="compact">
                <TableHeaderColumns orderBy={orderBy} orderDirection={orderDirection} onChangeOrder={onChangeOrder} />

                {metrics.map(metric => {
                  const definition = find(availableMetrics, m => m.metric === metric.metric);

                  return (
                    <SortableColumn
                      key={metric.metric}
                      orderBy={orderBy}
                      orderDirection={orderDirection}
                      onChangeOrder={onChangeOrder}
                      defaultDirection={definition.defaultOrderDirection || 'DESC'}
                      technicalName={buildOrderByCriteria(metric.metric, metric.aggregation)}
                      label={definition.rawDataLabel}
                    />
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {items.map(item => (
                <Tr key={item.beacon.beaconId} size="compact">
                  <TableRowColumns item={item} />

                  {metrics.map(metric => {
                    const definition = find(availableMetrics, m => m.metric === metric.metric);

                    return (
                      <Td key={definition.tag}>{definition.rawDataFormatter(item.beacon[definition.rawDataField])}</Td>
                    );
                  })}
                </Tr>
              ))}

              <HorizontalIndicatorRow cols={columnCount} progress={progress} />
              <ErrorRows cols={columnCount} errors={errors} size="compact" />
              {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={columnCount} />}
              {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={columnCount} />}
            </Tbody>
          </Table>
        </LeftRightPadding>
        <SetBodyColor color="#fff" />
      </Sticky>
    </>
  );
}
