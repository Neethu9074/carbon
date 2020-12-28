import classNames from 'classnames';
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { containsIgnoreCase } from 'in-services/util/string';
import SearchInput from 'in-new-components/SearchInput';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './SelectBarOverlay.mless';

// Items look like this:
// [
//   {label: '', key}
// ]

export default function SelectBarOverlay({
  query,
  loading,
  onQueryChange,
  filterSuggestionsClientSide,
  selectedItem,
  items,
  onSelectItem,
  moreDataAvailable,
  moreDataMessage,
  itemLabelRenderer
}) {
  return (
    <BarOverlay>
      <SearchInput onChange={onQueryChange} query={query} autoFocus />

      {selectedItem && (
        <Tooltip content={`Currently filtered by ${selectedItem.label}. Click to remove filter.`}>
          <Item item={selectedItem} selected onClick={() => onSelectItem(null)} itemLabelRenderer={itemLabelRenderer} />
        </Tooltip>
      )}

      {loading && <LoadingIndicator text="Loading filter options." className={locals.loading} height={100} />}

      {!loading && items.length === 0 && (
        <NoDataAvailable className={locals.loading} text="No filter options found." height={100} />
      )}

      {!loading && items.length > 0 && (
        <ul
          className={classNames({
            [locals.list]: true,
            [locals.listWithoutSelected]: !selectedItem
          })}
        >
          {items
            .filter(
              item =>
                (!filterSuggestionsClientSide || containsIgnoreCase(item.key, query)) &&
                (!selectedItem || item.key !== selectedItem.key)
            )
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
      className={classNames({
        [locals.item]: true,
        [locals.selectedItem]: selected
      })}
    >
      <span className={locals.itemText}>{itemLabelRenderer ? itemLabelRenderer(item.label) : item.label}</span>

      {selected && <SvgIcon className={locals.selectedIcon} type="lib_uncheck" size="s" />}
    </a>
  );
}
