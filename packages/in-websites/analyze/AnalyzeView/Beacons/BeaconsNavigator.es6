import { compose } from 'recompose';
import React from 'react';

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
import { getResponsiveNavigatorMode } from 'in-analyze/components/getResponsiveNavigatorMode';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';

export default compose(getResponsiveNavigatorMode)(BeaconsNavigator);

function BeaconsNavigator(props) {
  const { items, errors, progress, loadMore, canLoadMore, ListItemHeader, ListItem, beaconId } = props;

  return (
    <HeightRestrictedView
      render={() => (
        <Table tableInCard>
          <Thead>
            <Tr size="compact">
              <Th>{ListItemHeader}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map(item => (
              <Tr key={item.beacon.beaconId} size="compact" active={item.beacon.beaconId === beaconId}>
                <Td>
                  <ListItem item={item} active={item.beacon.beaconId === beaconId} />
                </Td>
              </Tr>
            ))}

            <HorizontalIndicatorRow cols={1} progress={progress} />
            <ErrorRows cols={1} errors={errors} size="compact" />
            {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={1} />}
            {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={1} />}
          </Tbody>
        </Table>
      )}
    />
  );
}
