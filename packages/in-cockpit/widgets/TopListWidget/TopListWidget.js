/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState, setPropTypes } from 'recompose';
import rpt from 'prop-types';
import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import DraggableLightCard from 'in-cockpit/widgets/TopListWidget/DraggableLightCard';
import StarredItemList from 'in-cockpit/widgets/TopListWidget/StarredItemList';
import ItemList from 'in-cockpit/widgets/TopListWidget/ItemList';
import Star from 'in-cockpit/widgets/TopListWidget/Star';
import SearchInput from 'in-new-components/SearchInput';
import { starredItems$ } from 'in-stores/starredItems';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './TopListWidget.mless';

export default compose(
  setPropTypes({
    getItems: rpt.func.isRequired,
    getItem: rpt.func,
    columnDefinitions: rpt.array.isRequired,
    pinnedItemTypes: rpt.array,
    getId: rpt.func.isRequired,
    pinItem: rpt.func.isRequired,
    unpinItem: rpt.func.isRequired,
    icon: rpt.string,
    header: rpt.object,
    fullListView$: rpt.object,
    fullListViewLinkTitle: rpt.string,
    getItemLink: rpt.func.isRequired,
    EmptyStateComponent: rpt.func
  }),
  withState('query', 'setQuery', ''),
  connectTo(({ pinnedItemTypes }) => ({
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
  })),
  connectTo(({ getItems, query, timeConfig, pinnedItemIdsByType }) => ({
    // these two will share the same subscription because query is initially empty
    result: timeConfig && pinnedItemIdsByType && getItems({ timeConfig, query, pinnedItemIdsByType }),
    resultForEmptyStateCheck: timeConfig && pinnedItemIdsByType && getItems({ timeConfig, pinnedItemIdsByType })
  }))
)(TopListWidget);

function TopListWidget(props) {
  const {
    query,
    setQuery,
    timeConfig,
    header,
    cardIcon,
    columnDefinitions,
    fullListView$,
    fullListViewLinkTitle,
    pinnedItemIdsByType,
    getItem,
    EmptyStateComponent = DefaultEmptyStateContent,
    getId,
    resultForEmptyStateCheck,
    getItemLink,
    pinItem,
    unpinItem,
    dragAndDropConfig
  } = props;
  let { label, result } = props;

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
      fullListView$={hasContent && fullListView$}
      dragAndDropConfig={dragAndDropConfig}
      useMaxAvailableHeight
      rightHeaderContent={
        <>
          {header && <div className={locals.customHeaderWrapper}>{header}</div>}
          {
            <SearchInput
              disabled={!hasContent}
              width={250}
              query={query}
              placeholder=""
              onChange={query => setQuery(query)}
            />
          }
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

      {!hasContent && <EmptyStateComponent {...props} />}

      {/* render an empty div to keep the link at the bottom of the card */}
      {hasContent && numberOfRegularItemsToShow === 0 && numberOfPinnedItems === 0 && <div />}
    </DraggableLightCard>
  );
}

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
