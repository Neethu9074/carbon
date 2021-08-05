/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { type as TAG_FILTER } from 'in-components/QueryBuilder/transformation/tagFilter';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

export function getFiltersCount(tagFilterExpression: FormModelElement[]): number {
  return tagFilterExpression.reduce((count, element) => {
    return element.type === TAG_FILTER ? count + 1 : count;
  }, 0);
}

export function getLimitedNumberOfFilters(
  tagFilterExpression: FormModelElement[],
  maxFilterToDisplay: number
): FormModelElement[] {
  const filtersToDisplay = [];
  let tagFilterCount = 0;

  for (const item of tagFilterExpression) {
    if (tagFilterCount === maxFilterToDisplay) {
      break;
    }
    filtersToDisplay.push(item);

    if (item.type === TAG_FILTER) {
      tagFilterCount++;
    }
  }

  return filtersToDisplay;
}
