import React, { Fragment } from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow
} from 'in-components/tables/sharedComponents';
import SortableCallColumn from 'in-analyze/components/SortableCallColumn';
import ResultHeader from 'in-analyze/components/ResultHeader';
import { formatDateTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './BeaconsPresenter.mless';

export default function BeaconsPresenter(props) {
  const {
    items,
    totalHits,
    totalRepresentedItemCount,
    errors,
    progress,
    loadMore,
    canLoadMore,
    orderBy,
    orderDirection,
    onChangeOrder
  } = props;

  return (
    <Fragment>
      <ResultHeader itemType="Beacon" nbRows={totalHits} nbItems={totalRepresentedItemCount} />
      <Table className={locals.table} tableInCard>
        <Thead>
          <Tr size="compact">
            <Th>Path</Th>

            <Th>Website</Th>

            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="beacon.timestamp"
              label="Timestamp"
            />

            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="beacon.duration"
              label="Duration"
            />
          </Tr>
        </Thead>
        <Tbody>
          {items.map(item => (
            <Tr key={item.beacon.beaconId} size="compact">
              <Td>
                {item.beacon.locationPath}
                {item.beacon.batchCount > 1 && (
                  <Fragment>
                    {' '}
                    <Tooltip
                      themeStyle="light"
                      content={`This beacon is batched and represents ${item.beacon.batchCount} individual errors.`}
                    >
                      <Pill className={locals.batchSizeIndicator} kind="lighter">
                        {item.beacon.batchCount}
                      </Pill>
                    </Tooltip>
                  </Fragment>
                )}
              </Td>

              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.websiteIcon} type="lib_website" width={24} height={24} />
                  {item.beacon.websiteLabel}
                </div>
              </Td>

              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.timeIcon} type="lib_datetime_time" width={16} height={16} />
                  {formatDateTime(item.beacon.timestamp)}
                </div>
              </Td>

              <Td>
                <span className={locals.metricValue}>{millis.fixedCompact(item.beacon.duration)}</span>
              </Td>
            </Tr>
          ))}

          <HorizontalIndicatorRow cols={5} progress={progress} />
          <ErrorRows cols={5} errors={errors} size="compact" />
          {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={5} />}
          {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={5} />}
        </Tbody>
      </Table>
    </Fragment>
  );
}
