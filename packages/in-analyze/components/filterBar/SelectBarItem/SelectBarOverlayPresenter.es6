import React from 'react';

import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import { evaluateClassNames } from 'in-services/util/classnames';
import SearchInput from 'in-new-components/SearchInput';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './SelectBarOverlayPresenter.mless';

// Items look like this:
// [
//   {label: '', key}
// ]

export default function SelectBarOverlayPresenter({
  query,
  loading,
  onQueryChange,
  selectedItem,
  items,
  onSelectItem,
  moreDataAvailable,
  moreDataMessage
}) {
  return (
    <BarOverlay>
      <SearchInput onChange={onQueryChange} query={query} autoFocus />

      {selectedItem && (
        <Tooltip content={`Currently filtered by ${selectedItem.label}. Click to remove filter.`}>
          <Item item={selectedItem} selected onClick={() => onSelectItem(null)} />
        </Tooltip>
      )}

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
              [locals.listWithoutSelected]: !selectedItem
            })}
          >
            {items.filter(item => !selectedItem || item.key !== selectedItem.key).map(item => (
              <li key={item.key}>
                <Tooltip content={`Click to filter by ${item.label}`}>
                  <Item item={item} onClick={onSelectItem} />
                </Tooltip>
              </li>
            ))}
          </ul>
        )}

      {!loading && moreDataAvailable && <div className={locals.more}>{moreDataMessage}</div>}
    </BarOverlay>
  );
}

function Item({ item, selected, onClick }) {
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
      <span className={locals.itemText}>{item.label}</span>

      {selected && <SvgIcon className={locals.selectedIcon} type="lib_uncheck" width={18} height={18} />}
    </a>
  );
}
