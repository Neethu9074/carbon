import React from 'react';

import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import EmptyList from 'in-new-components/lists/List/sharedComponents/EmptyList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import { containsIgnoreCase, compareIgnoreCase } from 'in-services/util/string';
import ApiListHeader from 'in-settings/components/ApiList/ApiListHeader';
import TemporaryMessage from 'in-new-components/TemporaryMessage';
import { hasError, isLoading } from 'in-services/util/result';
import Pagination from 'in-new-components/Pagination';

export default function ApiListRenderer(props) {
  if (isLoading(props.itemsResult)) {
    return <LoadingApiList {...props} />;
  }

  const {
    ListRenderer,
    page = 1,
    query,
    orderBy,
    searchFields,
    message,
    setPage,
    pageSize = 20,
    retainMessagesAfter = 5000,
    itemsResult,
    itemName,
    filterFunction
  } = props;

  const items = itemsResult.data || [];

  let filteredAndSortedItems = (searchFields && query
    ? items.filter(item => searchItem(item, searchFields, query))
    : items
  )
    .slice()
    .sort((a, b) => compareIgnoreCase(a[orderBy], b[orderBy]));

  if (filterFunction) {
    filteredAndSortedItems = filteredAndSortedItems.filter(filterFunction);
  }

  const totalItems = items.length;
  const totalFilteredItems = filteredAndSortedItems.length;

  const fromItems = pageSize * (page - 1);
  const pageItems = filteredAndSortedItems.slice(fromItems, fromItems + pageSize);
  const hasErrors = hasError(itemsResult);

  let content = <EmptyList />;
  if (hasErrors) {
    content = <ErrorList errors={itemsResult.errors} />;
  } else if (totalFilteredItems > 0) {
    content = <ListRenderer {...props} items={pageItems} />;
  }
  return (
    <>
      {message && <TemporaryMessage {...message} duration={retainMessagesAfter} />}
      {itemName && <ApiListHeader {...props} totalItems={totalItems} totalFilteredItems={totalFilteredItems} />}
      {content}
      <Pagination currentPage={page} numPages={Math.ceil(totalFilteredItems / pageSize)} onChange={setPage} />
    </>
  );
}

function LoadingApiList(props) {
  return (
    <>
      <ApiListHeader {...props} isLoading />
      <LoadingList />
    </>
  );
}

function searchItem(item, searchFields, query) {
  for (let i = 0; i < searchFields.length; i++) {
    if (containsIgnoreCase(item[searchFields[i]], query)) {
      return true;
    }
  }
  return false;
}
