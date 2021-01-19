/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { containsIgnoreCase } from 'in-services/util/string';
import SearchInput from 'in-new-components/SearchInput';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './MultiSelectBarOverlay.mless';

// Items look like this:
// [
//   {label: '', key}
// ]

export default function MultiSelectBarOverlay({
  query,
  loading,
  onQueryChange,
  filterSuggestionsClientSide,
  selectedItems,
  items,
  onSelectItem,
  moreDataAvailable,
  moreDataMessage,
  itemLabelRenderer,
  onRemoveItem
}) {
  const itemList = newItemList(items, selectedItems);
  return (
    <BarOverlay>
      <SearchInput onChange={onQueryChange} query={query} autoFocus />

      {selectedItems.length > 0 && (
        <ul
          className={classNames({
            [locals.listForSelected]: selectedItems
          })}
        >
          {selectedItems.map(item => (
            <li key={item.key}>
              <Item
                item={item}
                key={item.key}
                selected
                onClick={() => onRemoveItem(item)}
                itemLabelRenderer={itemLabelRenderer}
              />
            </li>
          ))}
        </ul>
      )}

      {!loading && moreDataAvailable && <div className={locals.more}>{moreDataMessage}</div>}

      {loading && <LoadingIndicator text="Loading filter options." className={locals.loading} height={100} />}

      {!loading && items.length === 0 && (
        <NoDataAvailable className={locals.loading} text="No filter options found." height={100} />
      )}

      {!loading && items.length > 0 && (
        <ul
          className={classNames({
            [locals.list]: true,
            [locals.listWithoutSelected]: !selectedItems
          })}
        >
          {itemList
            .filter(item => !filterSuggestionsClientSide || containsIgnoreCase(item.key, query))
            .map((item, i) => (
              <li key={`${item.key}${i}`}>
                <Tooltip content={`Click to filter by ${item.label}`}>
                  <Item item={item} onClick={onSelectItem} itemLabelRenderer={itemLabelRenderer} />
                </Tooltip>
              </li>
            ))}
        </ul>
      )}

      {!loading && moreDataAvailable && <div className={locals.more}>{moreDataMessage}</div>}
    </BarOverlay>
  );
}

const Item = forwardRef(function Item({ item, selected, onClick, itemLabelRenderer }, ref) {
  return (
    <a
      href=""
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        onClick(item);
      }}
      className={classNames({
        [locals.item]: true,
        [locals.selectedItem]: selected
      })}
      ref={ref}
    >
      <span className={locals.itemText}>{itemLabelRenderer ? itemLabelRenderer(item.label) : item.label}</span>

      {selected && <SvgIcon className={locals.selectedIcon} type="lib_uncheck" size="s" />}
    </a>
  );
});

function newItemList(items, selectedItems) {
  const filteredItems = items.filter(function(obj) {
    return !selectedItems.some(function(obj2) {
      return obj.key == obj2.key;
    });
  });
  return filteredItems;
}

MultiSelectBarOverlay.propTypes = {
  query: PropTypes.string,
  loading: PropTypes.bool,
  onQueryChange: PropTypes.func,
  filterSuggestionsClientSide: PropTypes.bool,
  selectedItems: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, label: PropTypes.string })),
  items: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, label: PropTypes.string })),
  onSelectItem: PropTypes.func,
  moreDataAvailable: PropTypes.bool,
  moreDataMessage: PropTypes.string,
  itemLabelRenderer: PropTypes.func,
  onRemoveItem: PropTypes.func
};
