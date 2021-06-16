/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';

/**
 *
 * @param {Object} tagFilterExpression the backend model of the tag-filter expression.
 * @param {Array} availableTagFilters Array of strings representing tag-filters which are allowed for the given tag-filter expression.
 * @returns cleaned up tag-filter expression where all filters which are not allowed are removed.
 */
export function removeExcludedFilters(tagFilterExpression, availableTagFilters) {
  // only one tagFilter, resetting UI Model needs to be done from the outside so we return null
  if (tagFilterExpression.type === 'TAG_FILTER' && !availableTagFilters.includes(tagFilterExpression.name)) {
    return emptyTagFilterExpression;
  }

  let { elements = [] } = tagFilterExpression;

  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];

    if (element.type === 'EXPRESSION') {
      removeExcludedFilters(element, availableTagFilters);
    }

    if (element.type === 'TAG_FILTER' && !availableTagFilters.includes(element.name)) {
      delete elements[i];
    }
  }

  const filteredElements = elements.filter(Boolean);
  tagFilterExpression.elements = filteredElements;
  return tagFilterExpression;
}
