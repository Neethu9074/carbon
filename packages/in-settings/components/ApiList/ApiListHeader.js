import React from 'react';

import SearchInput from 'in-new-components/SearchInput';

import locals from './ApiListHeader.mless';

export default function ApiListHeader(props) {
  const {
    itemName,
    totalItems,
    totalFilteredItems,
    searchPlaceholder,
    searchFields,
    query = '',
    setQuery,
    renderAdditionalHeaderContent,
    isLoading
  } = props;
  return (
    <header className={locals.header}>
      <span className={locals.itemName}>
        {`${itemName}s `}
        {!isLoading && <span className={locals.itemCount}>{`(${totalFilteredItems})`}</span>}
      </span>
      <div className={locals.right}>
        {renderAdditionalHeaderContent && renderAdditionalHeaderContent(props)}
        {searchFields &&
          totalItems > 0 && (
            <SearchInput
              maxWidth={200}
              placeholder={searchPlaceholder || `Filter ${itemName}s`}
              query={query}
              onChange={setQuery}
            />
          )}
      </div>
    </header>
  );
}
