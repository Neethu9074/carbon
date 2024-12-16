/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { DashboardTableCell as Cell } from '@instana/components';
import { LoadingSkeleton } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import WithPinnedItems from 'in-plg/pages/WelcomePage/widgets/table/WithPinnedItems';
import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter';
import { hasError, isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from 'in-plg/pages/WelcomePage/widgets/table/CommonTableStyle.mless';

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

const FAVOURITE = 'favourite';

export function Item({ pendingItem, timeConfig, type, columnDefinitions }: ItemProps) {
  const { id, result } = pendingItem;

  if (!result || isLoading(result)) {
    return (
      <>
        {columnDefinitions.map(({ key }: ColumnDefinitionItem) => {
          return (
            <Cell key={key}>
              {
                <LoadingSkeleton
                  className={classNames({
                    [locals.loadingSkeletonForFav]: key === FAVOURITE
                  })}
                />
              }
            </Cell>
          );
        })}
      </>
    );
  }
  if (hasError(result)) {
    return (
      <>
        {columnDefinitions.map(({ key, getContent }: ColumnDefinitionItem) => {
          return (
            <Cell key={key} {...(key === FAVOURITE && { className: 'favouriteIcon' })}>
              {key === 'name' || key === 'title' ? (
                <Tooltip content={getUniqueErrors(result.errors)[0]} align="auto" caret={false} delay={300}>
                  <div className={locals.errorTitleWidthForTooltip}>{'-'}</div>
                </Tooltip>
              ) : key === FAVOURITE ? (
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
        <Cell key={key} {...(key === FAVOURITE && { className: 'favouriteIcon' })}>
          {getContent({ id, item, result, timeConfig, isFavourite: true })}
        </Cell>
      ))}
    </>
  );
}
