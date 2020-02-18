import { compose, withState, setPropTypes } from 'recompose';
import { combineLatest } from 'reactive-observables';
import rpt from 'prop-types';
import React from 'react';

import { getFavItemIds, getFavItems, favoriseItem, unfavoriseItem } from 'in-cockpit/favItems/favItems';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import LightCard from 'in-new-components/Card/LightCard';
import SearchInput from 'in-new-components/SearchInput';
import { timeConfig$ } from 'in-stores/time/config';
import { compare } from 'in-services/util/boolean';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './TopListWidget.mless';

export default compose(
  setPropTypes({
    title: rpt.string.isRequired,
    getItems: rpt.func.isRequired,
    getFavItems$: rpt.func.isRequired,
    columnDefinitions: rpt.array.isRequired,
    getIdByItem: rpt.func.isRequired,
    getTypeByItem: rpt.func.isRequired,
    icon: rpt.string,
    header: rpt.object,
    fullListView$: rpt.object,
    fullListViewLinkTitle: rpt.string,
    favItemTypes: rpt.array
  }),
  withState('query', 'setQuery', ''),
  connectTo(({ getItems, favItemTypes, getFavItems$, getIdByItem, getTypeByItem, query }) => {
    const favItemIdsByType$ = getFavItemIds(favItemTypes);

    return {
      timeConfig: timeConfig$,
      favItemIdsByType: favItemIdsByType$,
      result: timeConfig$
        .flatMap(timeConfig =>
          combineLatest([
            getItems({ timeConfig, query }),
            favItemIdsByType$.flatMap(idsByType => getFavItems({ timeConfig, getFavItems$, idsByType })),
            favItemIdsByType$
          ])
        )
        .map(([itemsResult, favItemsResult, favItemIdsByType]) =>
          combineItemResults(itemsResult, favItemsResult, item =>
            isFavorised(item, favItemIdsByType, getIdByItem, getTypeByItem)
          )
        )
    };
  })
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
  getIdByItem,
  getTypeByItem,
  favItemIdsByType
}) {
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
      <ServerTablePresenter
        isSearchable={false}
        columnDefinitions={[
          ...columnDefinitions,
          {
            id: 'star',
            label: 'Star',
            width: 5,
            getContent(item) {
              const isItemFavorised = isFavorised(item, favItemIdsByType, getIdByItem, getTypeByItem);
              return (
                <SvgIcon
                  className={isItemFavorised ? locals.starIconFilled : locals.starIcon}
                  type={isItemFavorised ? 'lib_actions_star_filled' : 'lib_actions_star'}
                  onClick={() =>
                    (isItemFavorised ? unfavoriseItem : favoriseItem)(getTypeByItem(item), getIdByItem(item))
                  }
                />
              );
            }
          }
        ]}
        result={result}
        timeConfig={timeConfig}
        numSkeletonRows={5}
      />
      <Link className={locals.link} href$={fullListView$}>
        {fullListViewLinkTitle}
      </Link>
    </LightCard>
  );
}

function combineItemResults(itemsResult, favItemsResult, isItemFavorised) {
  if (itemsResult.data && itemsResult.data.items) {
    let items = itemsResult.data.items;
    if (favItemsResult.data && favItemsResult.data.items) {
      items = items.filter(item => !isItemFavorised(item));
      items = favItemsResult.data.items.concat(items);
    }
    items = items.slice(0, 5);
    items.sort((i1, i2) => compare(isItemFavorised(i1), isItemFavorised(i2)));

    return {
      ...itemsResult,
      data: {
        ...itemsResult.data,
        items
      }
    };
  }
  return itemsResult;
}

function isFavorised(item, favItemIdsByType, getIdByItem, getTypeByItem) {
  const itemId = getIdByItem(item);
  const favIds = favItemIdsByType[getTypeByItem(item)];
  return itemId && favIds && favIds.indexOf(itemId) !== -1;
}
