/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';

import locals from './BeaconsNavigator.mless';

export default function BeaconsNavigator(props) {
  const { items, errors, progress, loadMore, canLoadMore, ListItemHeader, ListItem, beaconId } = props;

  return (
    <HeightRestrictedView
      className={locals.navigator}
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
