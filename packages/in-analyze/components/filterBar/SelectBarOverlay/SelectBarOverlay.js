/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { containsIgnoreCase } from 'in-services/util/string';
import SearchInput from 'in-new-components/SearchInput';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

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
        <Tooltip
          content={t('in-analyze:filterBar.selectBarOverlay.tooltip', { selectedItemLabel: selectedItem.label })}
        >
          <Item item={selectedItem} selected onClick={() => onSelectItem(null)} itemLabelRenderer={itemLabelRenderer} />
        </Tooltip>
      )}

      {loading && (
        <LoadingIndicator
          text={t('in-analyze:filterBar.selectBarOverlay.loadingFilters')}
          className={locals.loading}
          height={100}
        />
      )}

      {!loading && items.length === 0 && (
        <NoDataAvailable
          className={locals.loading}
          text={t('in-analyze:filterBar.selectBarOverlay.noFiltersFound')}
          height={100}
        />
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
                <Tooltip content={t('in-analyze:filterBar.selectBarOverlay.clickToFilter', { itemLabel: item.label })}>
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
