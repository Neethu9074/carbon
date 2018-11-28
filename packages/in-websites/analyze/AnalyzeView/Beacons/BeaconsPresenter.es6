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
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import GroupingInfo from 'in-analyze/components/GroupingInfo/GroupingInfo';
import SortableColumn from 'in-analyze/components/SortableColumn';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import TimestampCell from 'in-analyze/components/TimestampCell';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { millis } from 'in-services/formatters/number';
import { dataSourceTitles } from 'in-websites/tags';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';
import Title from 'in-components/Title';

export default function BeaconsPresenter(props) {
  const { items, errors, progress, loadMore, canLoadMore, orderBy, orderDirection, onChangeOrder, beaconType } = props;

  return (
    <Fragment>
      <Title title={`Analyze ${dataSourceTitles[beaconType]}s`} />
      <AnalyzeHeader />
      <QuickFilterBar {...props} />
      <MaxWidthFullscreenContainer>
        <TagFilterList {...props} />
        <GroupingInfo {...props} />
        <GroupingTableHeader itemType={dataSourceTitles[beaconType]} nbItems={props.totalHits} {...props} />

        <Table tableInCard>
          <Thead>
            <Tr size="compact">
              <Th>Path</Th>

              <Th>Website</Th>

              <SortableColumn
                orderBy={orderBy}
                orderDirection={orderDirection}
                onChangeOrder={onChangeOrder}
                defaultDirection="DESC"
                technicalName="beacon.timestamp"
                label="Timestamp"
              />

              <SortableColumn
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
                        <Pill kind="lighter">{item.beacon.batchCount}</Pill>
                      </Tooltip>
                    </Fragment>
                  )}
                </Td>

                <Td>
                  <TableLinkWithIcon icon="lib_website" href$={getLinkToWebsite(item.beacon.websiteId)}>
                    {item.beacon.websiteLabel}
                  </TableLinkWithIcon>
                </Td>

                <Td>
                  <TimestampCell time={item.beacon.timestamp} />
                </Td>

                <Td>
                  <span>{millis.fixedCompact(item.beacon.duration)}</span>
                </Td>
              </Tr>
            ))}

            <HorizontalIndicatorRow cols={5} progress={progress} />
            <ErrorRows cols={5} errors={errors} size="compact" />
            {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={5} />}
            {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={5} />}
          </Tbody>
        </Table>
      </MaxWidthFullscreenContainer>
    </Fragment>
  );
}
