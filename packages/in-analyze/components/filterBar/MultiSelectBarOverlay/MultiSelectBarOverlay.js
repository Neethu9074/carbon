import PropTypes from 'prop-types';
import React from 'react';

import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import { evaluateClassNames } from 'in-services/util/classnames';
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
          className={evaluateClassNames({
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

      {loading && <InfiniteCircle customText="Loading filter options." className={locals.loading} height={100} />}

      {!loading &&
        items.length === 0 && (
          <NoDataAvailable className={locals.loading} text="No filter options found." height={100} />
        )}

      {!loading &&
        items.length > 0 && (
          <ul
            className={evaluateClassNames({
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

function Item({ item, selected, onClick, itemLabelRenderer }) {
  return (
    <a
      href=""
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        onClick(item);
      }}
      className={evaluateClassNames({
        [locals.item]: true,
        [locals.selectedItem]: selected
      })}
    >
      <span className={locals.itemText}>{itemLabelRenderer ? itemLabelRenderer(item.label) : item.label}</span>

      {selected && <SvgIcon className={locals.selectedIcon} type="lib_uncheck" size="s" />}
    </a>
  );
}

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
