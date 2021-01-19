/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { containsIgnoreCase, compareIgnoreCase } from 'in-services/util/string';
import { hasError, isLoading } from 'in-services/util/result';

export default function ResolveResult(props) {
  const { page = 1, query, orderBy, searchFields, pageSize = 20, itemsResult, filterFunction } = props;
  const items = itemsResult.data || [];
  const fromItems = pageSize * (page - 1);

  let filteredAndSortedItems = items;
  if (filterFunction) {
    filteredAndSortedItems = filteredAndSortedItems.filter(filterFunction);
  }
  if (searchFields && query) {
    filteredAndSortedItems = filteredAndSortedItems.filter(item => searchItem(item, searchFields, query));
  }
  const orderByFn = orderBy instanceof Function ? orderBy : (a, b) => compareIgnoreCase(a[orderBy], b[orderBy]);
  filteredAndSortedItems = filteredAndSortedItems.slice().sort(orderByFn);

  return props.children({
    ...props,
    totalItems: items.length,
    totalFilteredItems: filteredAndSortedItems.length,
    pageItems: filteredAndSortedItems.slice(fromItems, fromItems + pageSize),
    numPages: Math.ceil(filteredAndSortedItems.length / pageSize),
    hasErrors: hasError(itemsResult),
    isLoading: isLoading(itemsResult)
  });
}

function searchItem(item, searchFields, query) {
  for (let i = 0; i < searchFields.length; i++) {
    if (containsIgnoreCase(item[searchFields[i]], query)) {
      return true;
    }
  }
  return false;
}
