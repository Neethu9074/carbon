import React from 'react';

import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import EmptyList from 'in-new-components/lists/List/sharedComponents/EmptyList';
import { containsIgnoreCase, compareIgnoreCase } from 'in-services/util/string';
import ApiListHeader from 'in-settings/components/ApiList/ApiListHeader';
import TemporaryMessage from 'in-new-components/TemporaryMessage';
import Pagination from 'in-new-components/Pagination';
import { isLoading } from 'in-services/util/result';

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
    itemsResult
  } = props;

  const items = itemsResult.data || [];

  const filteredAndSortedItems = (searchFields && query
    ? items.filter(item => searchItem(item, searchFields, query))
    : items
  )
    .slice()
    .sort((a, b) => compareIgnoreCase(a[orderBy], b[orderBy]));

  const totalItems = items.length;
  const totalFilteredItems = filteredAndSortedItems.length;

  const fromItems = pageSize * (page - 1);
  const pageitems = filteredAndSortedItems.slice(fromItems, fromItems + pageSize);
  return (
    <>
      {message && <TemporaryMessage {...message} duration={retainMessagesAfter} />}
      <ApiListHeader {...props} totalItems={totalItems} totalFilteredItems={totalFilteredItems} />
      {totalFilteredItems > 0 ? <ListRenderer {...props} items={pageitems} /> : <EmptyList />}
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
