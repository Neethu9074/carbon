/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SearchInput } from '@instana/components';

import { t } from 'in-i18n';

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
          {t('in-settings:cardTitle', { context: itemName, count: 2 })}
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
            placeholder={searchPlaceholder || t('in-settings:components.search')}
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
