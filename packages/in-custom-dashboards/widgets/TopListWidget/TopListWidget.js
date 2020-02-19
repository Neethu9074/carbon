import { compose, withState, setPropTypes } from 'recompose';
import rpt from 'prop-types';
import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { getPinnedItems } from 'in-cockpit/pinnedItems/pinnedItems';
import { pendingResult } from 'in-services/fixedObjects';
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
    columnDefinitions: rpt.array.isRequired,
    pinnedItemTypes: rpt.array,
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
  pinItem,
  unpinItem
}) {
  const numPinnedItems = getNumPinnedItems(pinnedItemIdsByType);
  const numRegularItems = Math.max(0, 5 - numPinnedItems);
  if (result && result.data) {
    result = {
      ...result,
      data: {
        items: result.data.items.slice(0, numRegularItems)
      }
    };
  }

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
      {numPinnedItems > 0 && (
        <ServerTablePresenter
          isSearchable={false}
          columnDefinitions={[...columnDefinitions, getStarColumn(true, pinItem, unpinItem)]}
          result={pendingResult}
          timeConfig={timeConfig}
          numSkeletonRows={numPinnedItems}
        />
      )}
      {numRegularItems > 0 && (
        <ServerTablePresenter
          isSearchable={false}
          columnDefinitions={[...columnDefinitions, getStarColumn(false, pinItem, unpinItem)]}
          result={result}
          timeConfig={timeConfig}
          numSkeletonRows={numRegularItems}
        />
      )}
      <Link className={locals.link} href$={fullListView$}>
        {fullListViewLinkTitle}
      </Link>
    </LightCard>
  );
}

function getNumPinnedItems(IdsByType) {
  let numItems = 0;
  const keys = Object.keys(IdsByType);
  for (let i = 0; i < keys.length; i++) {
    const ids = IdsByType[keys[i]];
    if (ids) {
      numItems += ids.length;
    }
  }
  return numItems;
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
