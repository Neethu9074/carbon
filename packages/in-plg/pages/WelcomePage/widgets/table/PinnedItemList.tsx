/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardTableCell as Cell } from '@instana/components';
import { LoadingSkeleton, Message } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter';
import { hasError, isLoading } from 'in-services/util/result';
import WithPinnedItems from './WithPinnedItems';

type pinnedItemsListProps = {
  pinnedItemIdsByType?: any;
  getItem: any;
  timeConfig: TimeConfig;
  processResults: any;
};

export default function PinnedItemList({
  getItem,
  timeConfig,
  pinnedItemIdsByType,
  processResults
}: pinnedItemsListProps) {
  return (
    <WithPinnedItems
      pinnedItemIdsByType={pinnedItemIdsByType}
      getItem={getItem}
      timeConfig={timeConfig}
      render={processResults}
    />
  );
}

interface ItemProps {
  pendingItem?: any;
  type?: string;
  timeConfig?: TimeConfig;
  columnDefinitions: ColumnDefinitionItem[];
}

export function Item({ pendingItem, timeConfig, type, columnDefinitions }: ItemProps) {
  const { id, result } = pendingItem;

  if (!result || isLoading(result)) {
    return (
      <>
        {columnDefinitions.map(({ key }: ColumnDefinitionItem) => {
          return <Cell key={key}>{<LoadingSkeleton />}</Cell>;
        })}
      </>
    );
  }
  if (hasError(result)) {
    return (
      <>
        {columnDefinitions.map(({ key, getContent }: ColumnDefinitionItem) => {
          return (
            <Cell key={key}>
              {key === 'name' || key === 'title' ? (
                <Message type="error" small>
                  {getUniqueErrors(result.errors)[0]}
                </Message>
              ) : key === 'favourite' ? (
                <div>{getContent({ id: id, item: null, isFavourite: true, type: type })}</div>
              ) : null}
            </Cell>
          );
        })}
      </>
    );
  }

  let item = result.data ? result.data : result;
  item = {
    ...item,
    pinned: true
  };
  return (
    <>
      {columnDefinitions.map(({ key, getContent }: ColumnDefinitionItem) => (
        <Cell key={key}>{getContent({ id, item, result, timeConfig, isFavourite: true })}</Cell>
      ))}
    </>
  );
}
