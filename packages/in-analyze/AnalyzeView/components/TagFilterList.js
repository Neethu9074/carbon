import React from 'react';

import TagFilter from 'in-analyze/AnalyzeView/components/TagFilter';

import locals from './TagFilterList.mless';

export default function TagFilterList({
  tagFilters,
  defaultFilters,
  filterConnectionOperators = ['AND'],
  onOperatorChanged
}) {
  const tagFiltersToPresent = tagFilters.filter(tagFilter => !isInDefaultFilters(defaultFilters, tagFilter)); // do not display default filters

  if (tagFiltersToPresent.length === 0) {
    return null;
  }

  return (
    <div className={locals.tagFilterListWrapper}>
      <ul className={locals.tagFilterList}>
        {tagFiltersToPresent.map((tagFilter, i) => {
          return (
            <li key={i} className={locals.item}>
              <TagFilter
                tagFilter={tagFilter}
                isFirstOperator={i === 0}
                isLastOperator={i === tagFilters.length - 1}
                isOrConjunction={tagFilter.tag.conjunction === 'OR'}
                filterConnectionOperators={filterConnectionOperators}
                onOperatorChanged={operator => onOperatorChanged(i, operator)}
                isOnlyFilter={tagFilters.length === 1}
                allSameFilters={isSameConjunctions(tagFiltersToPresent)}
                index={i}
                tagFiltersToPresent={tagFiltersToPresent}
              />
            </li>
          );
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
