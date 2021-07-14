/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import shallowEqual from 'fbjs/lib/shallowEqual';

import { EQUALS, GREATER_OR_EQUAL_THAN, LESS_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { joinExpressions, TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';

// Removing facet items for the given tag is required to enable multi-select suggestions
// Otherwise the tagFilterExpression for the current tag would limit the returned results to already selected items
export function toBackendQuery({ formModel, facets, facetedSearchConfiguration, tagToExclude, ...props }) {
  const facetsExcludingTagForSuggestions = removeFacetTag(facets, tagToExclude);
  const tagFilterFromFacets = tagFiltersFromFacets(facetedSearchConfiguration, facetsExcludingTagForSuggestions);
  let formModelIncludingFacets = joinExpressions({ expressions: [formModel, tagFilterFromFacets] });
  if (props.excludeMissingGroupingTagFilterExpression) {
    // Because the grouped view doesn't support a special 'Tag not present' group, faceted search
    // should filter out items which would belong to this group for consistency with the result list.
    formModelIncludingFacets = joinExpressions({
      expressions: [formModelIncludingFacets, props.excludeMissingGroupingTagFilterExpression]
    });
  }
  return toBackendQueryModel(formModelIncludingFacets);
}

export function removeFacetTag(facets, tag) {
  const newFacets = {
    ...facets
  };
  delete newFacets[tag];
  return newFacets;
}

export function removeFacetItem(facets, tag, itemToDelete) {
  const filteredSelection = facets[tag]?.filter(selection => !shallowEqual(selection, itemToDelete));
  const newFacets = {
    ...facets,
    [tag]: filteredSelection
  };
  if (filteredSelection == null || filteredSelection.length === 0) {
    delete newFacets[tag];
  }
  return newFacets;
}

export function addFacetItem(facets, tag, newItem) {
  const currentSelection = facets[tag] ?? [];
  return {
    ...facets,
    [tag]: [...new Set([...currentSelection, newItem])]
  };
}

export function tagFiltersFromFacets(facetedSearchConfiguration, facets) {
  let andFilters = [];
  for (let facetedSearchItem of facetedSearchConfiguration) {
    const selectionForTag = facets[facetedSearchItem.tag] ?? [];
    let orFilters = [];
    for (let value of selectionForTag) {
      if (isRangeObject(value)) {
        const rangeTagFilter = createRangeTagFilterExpression(value, facetedSearchItem.tag);
        if (rangeTagFilter != null) {
          orFilters.push(rangeTagFilter);
        }
      } else {
        const isValidEntity = facetedSearchItem.entity != null && facetedSearchItem.entity !== NOT_APPLICABLE;
        orFilters.push({
          type: TAG,
          name: facetedSearchItem.tag,
          operator: EQUALS,
          value: value,
          ...(isValidEntity ? { entity: facetedSearchItem.entity } : null)
        });
      }
    }
    if (orFilters.length > 0) {
      andFilters.push(joinExpressions({ logicalOperator: or, expressions: orFilters }));
    }
  }
  return joinExpressions({ expressions: andFilters });
}

const createRangeTagFilterExpression = (rangeObject, tag) => {
  const minFilter = createMinimumValueTagFilterExpression(rangeObject.from, tag);
  const maxFilter = createMaximumValueTagFilterExpression(rangeObject.to, tag);
  if (minFilter && maxFilter) {
    if (minFilter.value === maxFilter.value) {
      return {
        type: TAG,
        name: tag,
        operator: EQUALS,
        value: minFilter.value
      };
    } else {
      return joinExpressions({ expressions: [minFilter, maxFilter] });
    }
  } else if (maxFilter) {
    return maxFilter;
  } else {
    return minFilter;
  }
};

export function getRangesFromFacets(facets, tag) {
  const possibleRanges = facets[tag] ?? [{}];

  return possibleRanges.map(range => {
    let from = null;
    let to = null;
    if (typeof range.from === 'number') {
      from = range.from;
    }
    if (typeof range.to === 'number') {
      to = range.to;
    }
    return { from, to };
  });
}

const createMinimumValueTagFilterExpression = (value, tag) => {
  if (typeof value !== 'number') {
    return;
  }
  return {
    type: TAG,
    name: tag,
    operator: GREATER_OR_EQUAL_THAN,
    value
  };
};
const createMaximumValueTagFilterExpression = (value, tag) => {
  if (typeof value !== 'number') {
    return;
  }
  return {
    type: TAG,
    name: tag,
    operator: LESS_THAN,
    value
  };
};

const isRangeObject = ({ from, to }) => {
  return typeof from === 'number' || typeof to === 'number';
};
