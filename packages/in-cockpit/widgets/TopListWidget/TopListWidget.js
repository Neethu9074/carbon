/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SearchInput } from '@instana/components';
import { useObservable } from '@instana/hooks';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import DraggableLightCard from 'in-cockpit/widgets/TopListWidget/DraggableLightCard';
import StarredItemList from 'in-cockpit/widgets/TopListWidget/StarredItemList';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import ItemList from 'in-cockpit/widgets/TopListWidget/ItemList';
import Star from 'in-cockpit/widgets/TopListWidget/Star';
import { starredItems$ } from 'in-cockpit/starredItems';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './TopListWidget.mless';

export default connectTo(({ pinnedItemTypes }) => ({
  timeConfig: timeConfig$,
  pinnedItemIdsByType: starredItems$.map(starredItems =>
    starredItems.reduce((agg, starredItem) => {
      if (pinnedItemTypes.indexOf(starredItem.type) !== -1) {
        agg[starredItem.type] = agg[starredItem.type] || [];
        agg[starredItem.type].push(starredItem.id);
      }
      return agg;
    }, {})
  )
}))(function TopListWidget(props) {
  const {
    timeConfig,
    header,
    cardIcon,
    columnDefinitions,
    fullListView,
    fullListViewLinkTitle,
    getItem,
    EmptyStateComponent = DefaultEmptyStateContent,
    getId,
    getItemLink,
    pinItem,
    unpinItem,
    dragAndDropConfig,
    getItems,
    pinnedItemIdsByType
  } = props;
  const [query, setQuery] = useState('');

  let result = useObservable(getItems({ timeConfig, query, pinnedItemIdsByType }), [
    timeConfig,
    query,
    pinnedItemIdsByType
  ]);
  let resultForEmptyStateCheck = useObservable(getItems({ timeConfig, pinnedItemIdsByType }), [
    timeConfig,
    pinnedItemIdsByType
  ]);

  let { label } = props;

  const flattenedPinnedIds = getFlattenedIds(pinnedItemIdsByType);
  const numberOfPinnedItems = flattenedPinnedIds.length;
  let numberOfRegularItemsToShow = Math.max(0, 5 - numberOfPinnedItems);

  if (result && result.data) {
    const regularItems = result.data.items.filter(item => flattenedPinnedIds.indexOf(getId(item)) === -1);
    let totalCount = result.data.items.length;
    if (result.data.totalHits) {
      totalCount = result.data.totalHits;
    }
    if (totalCount > 0) {
      label = `${label} (${totalCount})`;
    }

    result = {
      ...result,
      data: { items: regularItems.slice(0, numberOfRegularItemsToShow) }
    };
    numberOfRegularItemsToShow = result.data.items.length;
  }

  const hasContent = hasContentToRender(resultForEmptyStateCheck, numberOfPinnedItems);

  return (
    <DraggableLightCard
      label={label}
      icon={cardIcon}
      fullListViewLinkTitle={hasContent && fullListViewLinkTitle}
      fullListView={hasContent && fullListView}
      dragAndDropConfig={dragAndDropConfig}
      useMaxAvailableHeight
      rightHeaderContent={
        <>
          {header && <div className={locals.customHeaderWrapper}>{header}</div>}
          <SearchInput disabled={!hasContent} width={250} query={query} onChange={query => setQuery(query)} />
        </>
      }
    >
      <div className={locals.listsWrapper}>
        {numberOfPinnedItems > 0 && (
          <StarredItemList
            timeConfig={timeConfig}
            getItem={getItem}
            getItemLink={getItemLink}
            pinnedItemIdsByType={pinnedItemIdsByType}
            unpinItem={unpinItem}
            columnDefinitions={[
              ...columnDefinitions,
              {
                width: '2rem',
                getContent({ id, type }) {
                  return <Star pinned onClick={() => unpinItem(id, type)} />;
                }
              }
            ]}
          />
        )}

        {numberOfRegularItemsToShow > 0 && (
          <ItemList
            result={result}
            timeConfig={timeConfig}
            getItemLink={getItemLink}
            numSkeletonRows={numberOfRegularItemsToShow}
            columnDefinitions={[
              ...columnDefinitions,
              {
                width: '2rem',
                getContent({ item }) {
                  return <Star onClick={() => pinItem(getId(item), item)} />;
                }
              }
            ]}
          />
        )}
      </div>

      {!hasContent && (
        <EmptyStateComponent {...props} result={result} resultForEmptyStateCheck={resultForEmptyStateCheck} />
      )}

      {hasContent && numberOfRegularItemsToShow === 0 && numberOfPinnedItems === 0 && <NoDataAvailable height={230} />}
    </DraggableLightCard>
  );
});

function hasContentToRender(result, numberOfPinnedItems) {
  if (!result || !result.data) {
    return true;
  }
  return result.data.items.length + numberOfPinnedItems > 0;
}

export function getFlattenedIds(idsByType) {
  let allIds = [];
  const keys = Object.keys(idsByType);
  for (let i = 0; i < keys.length; i++) {
    const ids = idsByType[keys[i]];
    if (ids) {
      allIds = allIds.concat(ids);
    }
  }
  return allIds;
}

function DefaultEmptyStateContent({ cardIcon, label }) {
  return (
    <EntityPageMainNotification
      icon={cardIcon}
      title={t('in-cockpit:widgets.topListWidget.noLabelYet', { nolabel: label })}
    />
  );
}
