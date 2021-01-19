/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SearchInput from 'in-new-components/SearchInput';

import locals from './ApiListHeader.mless';

export default function ApiListHeader(props) {
  const {
    itemName,
    totalFilteredItems,
    searchPlaceholder,
    searchFields,
    query = '',
    setQuery,
    totalItems,
    renderAdditionalHeaderContent,
    isLoading
  } = props;
  return (
    <header className={locals.header}>
      {itemName ? (
        <span className={locals.itemName}>
          {`${itemName}s `}
          {!isLoading && (
            <span className={locals.itemCount}>{getItemCountPostfix(totalFilteredItems, totalItems)}</span>
          )}
        </span>
      ) : (
        <div />
      )}
      <div className={locals.right}>
        {renderAdditionalHeaderContent && renderAdditionalHeaderContent(props)}
        {searchFields && (
          <SearchInput
            className={locals.searchInput}
            maxWidth={200}
            placeholder={searchPlaceholder || 'Search...'}
            query={query}
            onChange={setQuery}
          />
        )}
      </div>
    </header>
  );
}

function getItemCountPostfix(filteredItems, totalItems) {
  return filteredItems === totalItems ? `(${totalItems})` : `(${filteredItems}/${totalItems})`;
}
