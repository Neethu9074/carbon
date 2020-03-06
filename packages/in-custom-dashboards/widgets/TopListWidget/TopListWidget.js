import { compose, withState, setPropTypes } from 'recompose';
import rpt from 'prop-types';
import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import DraggableLightCard from 'in-custom-dashboards/widgets/TopListWidget/DraggableLightCard';
import StarredItemList from 'in-custom-dashboards/widgets/TopListWidget/StarredItemList';
import ItemList from 'in-custom-dashboards/widgets/TopListWidget/ItemList';
import { getPinnedItems } from 'in-cockpit/pinnedItems/pinnedItems';
import Star from 'in-custom-dashboards/widgets/TopListWidget/Star';
import SearchInput from 'in-new-components/SearchInput';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

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
  connectTo(({ getItems, pinnedItemTypes, query }) => ({
    timeConfig: timeConfig$,
    pinnedItemIdsByType: getPinnedItems(pinnedItemTypes),
    result: timeConfig$.flatMap(timeConfig => getItems({ timeConfig, query })),
    resultForEmptyStateCheck: timeConfig$.flatMap(timeConfig => getItems({ timeConfig }))
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
    unpinItem
  } = props;
  let { label, result } = props;

  const flattenedIds = getFlattenedIds(pinnedItemIdsByType);
  const numPinnedItems = flattenedIds.length;
  let numRegularItems = Math.max(0, 5 - numPinnedItems);
  if (result && result.data) {
    const filteredItems = result.data.items.filter(item => flattenedIds.indexOf(getId(item)) === -1);
    if (filteredItems.length + numPinnedItems > 0) {
      label = `${label} (${filteredItems.length + numPinnedItems})`;
    }

    result = {
      ...result,
      data: { items: filteredItems.slice(0, numRegularItems) }
    };
    numRegularItems = result.data.items.length;
  }

  const pinItemCb = item => pinItem(getId(item), item);
  const unpinItemCb = item => unpinItem(getId(item), item);
  const hasContent = hasContentToRender(resultForEmptyStateCheck, numPinnedItems);

  return (
    <DraggableLightCard
      label={label}
      icon={cardIcon}
      fullListViewLinkTitle={hasContent && fullListViewLinkTitle}
      fullListView$={hasContent && fullListView$}
      useMaxAvailableHeight
      rightHeaderContent={
        hasContent && (
          <>
            {header && <div className={locals.customHeaderWrapper}>{header}</div>}
            <SearchInput width={250} query={query} placeholder="" onChange={query => setQuery(query)} />
          </>
        )
      }
    >
      <div className={locals.listsWrapper}>
        {numPinnedItems > 0 && (
          <StarredItemList
            timeConfig={timeConfig}
            getItem={getItem}
            getItemLink={getItemLink}
            pinnedItemIdsByType={pinnedItemIdsByType}
            columnDefinitions={[
              ...columnDefinitions,
              {
                width: '2rem',
                getContent(item) {
                  return <Star pinned pinItem={pinItemCb} unpinItem={unpinItemCb} item={item} />;
                }
              }
            ]}
          />
        )}

        {numRegularItems > 0 && (
          <ItemList
            result={result}
            timeConfig={timeConfig}
            getItemLink={getItemLink}
            numSkeletonRows={numRegularItems}
            columnDefinitions={[
              ...columnDefinitions,
              {
                width: '2rem',
                getContent(item) {
                  return <Star pinItem={pinItemCb} unpinItem={unpinItemCb} item={item} />;
                }
              }
            ]}
          />
        )}
      </div>

      {!hasContent && <EmptyStateComponent {...props} />}

      {/* render an empty div to keep the link at the bottom of the card */}
      {hasContent && numRegularItems === 0 && numPinnedItems === 0 && <div />}
    </DraggableLightCard>
  );
}

function hasContentToRender(result, numPinnedItems) {
  if (!result || !result.data) {
    return true;
  }
  return result.data.items.length + numPinnedItems > 0;
}

function getFlattenedIds(IdsByType) {
  let allIds = [];
  const keys = Object.keys(IdsByType);
  for (let i = 0; i < keys.length; i++) {
    const ids = IdsByType[keys[i]];
    if (ids) {
      allIds = allIds.concat(ids);
    }
  }
  return allIds;
}

function DefaultEmptyStateContent({ cardIcon, label }) {
  return <EntityPageMainNotification icon={cardIcon} title={`No ${label} yet`} />;
}
