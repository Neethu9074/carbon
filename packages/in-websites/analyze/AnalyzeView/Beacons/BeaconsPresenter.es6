import React, { Fragment } from 'react';
import { find, uniqBy } from 'lodash';

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
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';
import SortableColumn from 'in-analyze/components/SortableColumn';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { dataSourceTitles } from 'in-websites/tags';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

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

  let metricsForTable = metrics.filter(m => getTag(availableMetrics, m));
  metricsForTable = uniqBy(metricsForTable, m => getTag(availableMetrics, m));

  const columnCount = perTypeColumnCount + metricsForTable.length;

  return (
    <Fragment>
      <Title title={`Analyze ${dataSourceTitles[beaconType]}s`} />
      <Sticky
        header={
          <Fragment>
            <AnalyzeHeader />
            <QuickFilterBar showWebsiteSelector showPageSelector {...props} />
          </Fragment>
        }
      >
        <MaxWidthFullscreenContainer>
          <TagFilterList {...props} />
          <GroupingInfo {...props} />
          <GroupingTableHeader itemType={dataSourceTitles[beaconType]} nbItems={props.totalHits} {...props} />

          <Table tableInCard>
            <Thead>
              <Tr size="compact">
                <TableHeaderColumns orderBy={orderBy} orderDirectio={orderDirection} onChangeOrder={onChangeOrder} />

                {metricsForTable.map(metric => {
                  const definition = find(availableMetrics, m => m.metric === metric.metric);

                  return (
                    <SortableColumn
                      key={metric.metric}
                      orderBy={orderBy}
                      orderDirection={orderDirection}
                      onChangeOrder={onChangeOrder}
                      defaultDirection={definition.defaultOrderDirection || 'DESC'}
                      technicalName={definition.tag}
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

                  {metricsForTable.map(metric => {
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
        </MaxWidthFullscreenContainer>
      </Sticky>
    </Fragment>
  );
}

function getTag(availableMetrics, metric) {
  const definition = find(availableMetrics, m => m.metric === metric.metric);
  return definition && definition.tag;
}
