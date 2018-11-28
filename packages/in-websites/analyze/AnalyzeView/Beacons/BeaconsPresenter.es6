import React, { Fragment } from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
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
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { dataSourceTitles } from 'in-websites/tags';
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
    TableRowColumns
  } = props;

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
              <TableHeaderColumns orderBy={orderBy} orderDirectio={orderDirection} onChangeOrder={onChangeOrder} />
            </Tr>
          </Thead>
          <Tbody>
            {items.map(item => (
              <Tr key={item.beacon.beaconId} size="compact">
                <TableRowColumns item={item} />
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
