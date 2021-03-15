/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TagFilter from 'in-analyze/AnalyzeView/components/TagFilter';

import localsShared from './TagSharedList.mless';
import locals from './TagFilterList.mless';

export default function TagFilterList({
  tagFilters,
  defaultFilters,
  filterConnectionOperators = ['AND'],
  onOperatorChanged,
  readonlyFilterNames = [],
  hiddenFilterNames = []
}) {
  const tagFiltersToPresent = tagFilters.filter(tagFilter => !isInDefaultFilters(defaultFilters, tagFilter)); // do not display default filters

  if (tagFiltersToPresent.length === 0) {
    return null;
  }

  return (
    <div className={locals.tagFilterListWrapper}>
      <ul className={localsShared.tagList}>
        {tagFiltersToPresent.map((tagFilter, i) => {
          if (hiddenFilterNames?.includes(tagFilter.tag.name)) {
            return null;
          } else {
            return (
              <li key={i} className={localsShared.item}>
                <TagFilter
                  tagFilter={tagFilter}
                  isFirstOperator={i === 0}
                  isLastOperator={i === tagFilters.length - hiddenFilterNames.length - 1}
                  isOrConjunction={tagFilter.tag.conjunction === 'OR'}
                  filterConnectionOperators={filterConnectionOperators}
                  onOperatorChanged={operator => onOperatorChanged(i, operator)}
                  isOnlyFilter={tagFilters.length - hiddenFilterNames.length === 1}
                  allSameFilters={isSameConjunctions(tagFiltersToPresent)}
                  index={i}
                  tagFiltersToPresent={tagFiltersToPresent}
                  readonly={readonlyFilterNames.includes(tagFilter.tag.name)}
                />
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}

function isInDefaultFilters(defaultFilters = [], tagFilter) {
  return (
    defaultFilters.filter(
      defaultFilter => defaultFilter.name === tagFilter.tag.name && defaultFilter.value === tagFilter.tag.value
    ).length > 0
  );
}

function isSameConjunctions(tagFilters) {
  // First we check if the list is over 2 items long. We check because we don't apply the layout until there's more than 2 items.
  // Because the latest added tag is always added with the AND conjunction but it has no effect unless followed by another tag.
  return (
    tagFilters.length > 2 &&
    tagFilters.slice(0, -1).every(filter => filter.tag.conjunction === tagFilters[0].tag.conjunction)
  );
}
