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
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import SortableColumn from 'in-analyze/components/SortableColumn';
import { evaluateClassNames } from 'in-services/util/classnames';
import { formatDateTime } from 'in-services/formatters/date';
import Link from 'in-components/Link';

import locals from './LogsNavigator.mless';

export default function LogsNavigator({
  items,
  errors,
  orderBy,
  progress,
  loadMore,
  canLoadMore,
  onChangeOrder,
  onChangeAndGetAsUrl,
  logId: selectedlogId
}) {
  return (
    <HeightRestrictedView
      render={() => (
        <Table tableInCard>
          <Thead>
            <Tr size="compact">
              <SortableColumn
                orderBy={orderBy.by}
                orderDirection={orderBy.direction}
                onChangeOrder={onChangeOrder}
                defaultDirection="DESC"
                technicalName="timestamp"
                label="Timestamp"
              />
            </Tr>
          </Thead>
          <Tbody>
            {items.map(item => {
              const isSelected = item.log.id === selectedlogId;
              return (
                <Tr key={item.log.id} size="compact" active={isSelected}>
                  <Td active={isSelected} colSpan={3}>
                    <ListItemPresenter
                      item={item}
                      active={isSelected}
                      label={<>{item.log.strippedContent}</>}
                      time={item.log.timestamp}
                      href={onChangeAndGetAsUrl({ logId: item.log.id })}
                    />
                  </Td>
                </Tr>
              );
            })}

            <HorizontalIndicatorRow cols={3} progress={progress} />
            <ErrorRows cols={3} errors={errors} size="compact" />
            {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={3} />}
            {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={3} />}
          </Tbody>
        </Table>
      )}
    />
  );
}

function ListItemPresenter({ label, time, href, active }) {
  return (
    <Link
      className={evaluateClassNames({
        [locals.item]: true,
        [locals.active]: active
      })}
      href={href}
    >
      <span className={locals.label}>{label}</span>
      <div className={locals.secondRow}>
        <time dateTime={new Date(time).toISOString()}>{formatDateTime(time)}</time>
      </div>
    </Link>
  );
}
