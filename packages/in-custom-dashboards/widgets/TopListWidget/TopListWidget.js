import { compose, withState, setPropTypes } from 'recompose';
import rpt from 'prop-types';
import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { getPinnedItems } from 'in-cockpit/pinnedItems/pinnedItems';
import ServerTable from 'in-components/tables/ServerTable';
import LightCard from 'in-new-components/Card/LightCard';
import SearchInput from 'in-new-components/SearchInput';
import { timeConfig$ } from 'in-stores/time/config';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './TopListWidget.mless';

export default compose(
  setPropTypes({
    title: rpt.string.isRequired,
    getItems: rpt.func.isRequired,
    getItemsByGroupedIds: rpt.func,
    columnDefinitions: rpt.array.isRequired,
    pinnedItemTypes: rpt.array,
    getId: rpt.func.isRequired,
    pinItem: rpt.func.isRequired,
    unpinItem: rpt.func.isRequired,
    icon: rpt.string,
    header: rpt.object,
    fullListView$: rpt.object,
    fullListViewLinkTitle: rpt.string
  }),
  withState('query', 'setQuery', ''),
  connectTo(({ getItems, pinnedItemTypes, query }) => ({
    timeConfig: timeConfig$,
    pinnedItemIdsByType: getPinnedItems(pinnedItemTypes),
    result: timeConfig$.flatMap(timeConfig => getItems({ timeConfig, query }))
  }))
)(TopListWidget);

function TopListWidget({
  query,
  setQuery,
  title,
  timeConfig,
  result,
  header,
  icon,
  columnDefinitions,
  fullListView$,
  fullListViewLinkTitle,
  pinnedItemIdsByType,
  getItemsByGroupedIds,
  getId,
  pinItem,
  unpinItem
}) {
  const flattenedIds = getFlattenedIds(pinnedItemIdsByType);
  const numPinnedItems = flattenedIds.length;
  let numRegularItems = Math.max(0, 5 - numPinnedItems);
  if (result && result.data) {
    const filteredItems = result.data.items.filter(item => flattenedIds.indexOf(getId(item)) === -1);
    if (filteredItems.length + numPinnedItems > 0) {
      title = `${title} (${filteredItems.length + numPinnedItems})`;
    }

    result = {
      ...result,
      data: {
        // this works as long as the queried page size is >= 10
        items: filteredItems.slice(0, numRegularItems)
      }
    };
    numRegularItems = result.data.items.length;
  }

  const pinItemCb = item => pinItem(getId(item), item);
  const unpinItemCb = item => unpinItem(getId(item), item);

  return (
    <LightCard
      title={title}
      icon={icon}
      useMaxAvailableHeight
      rightHeaderContent={
        <>
          {header && <div className={locals.customHeaderWrapper}>{header}</div>}
          <SearchInput width={250} query={query} placeholder="" onChange={query => setQuery(query)} />
        </>
      }
      bodyClassName={locals.content}
    >
      {numPinnedItems > 0 &&
        getItemsByGroupedIds && (
          <ServerTable
            isSearchable={false}
            columnDefinitions={[...columnDefinitions, getStarColumn(true, pinItemCb, unpinItemCb)]}
            get={() => getItemsByGroupedIds(pinnedItemIdsByType, timeConfig)}
            timeConfig={timeConfig}
            numSkeletonRows={numPinnedItems}
          />
        )}
      {numRegularItems > 0 && (
        <ServerTablePresenter
          isSearchable={false}
          columnDefinitions={[...columnDefinitions, getStarColumn(false, pinItemCb, unpinItemCb)]}
          result={result}
          timeConfig={timeConfig}
          numSkeletonRows={numRegularItems}
        />
      )}

      {numRegularItems === 0 && numPinnedItems === 0 && <NoDataAvailable />}

      {fullListViewLinkTitle &&
        fullListView$ && (
          <Link className={locals.link} href$={fullListView$}>
            {fullListViewLinkTitle}
          </Link>
        )}
    </LightCard>
  );
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

function getStarColumn(pinned, pinItem, unpinItem) {
  return {
    id: 'star',
    label: 'Star',
    width: 5,
    getContent(item) {
      return (
        <SvgIcon
          className={pinned ? locals.starIconFilled : locals.starIcon}
          type={pinned ? 'lib_actions_star_filled' : 'lib_actions_star'}
          onClick={() => (pinned ? unpinItem : pinItem)(item)}
        />
      );
    }
  };
}
