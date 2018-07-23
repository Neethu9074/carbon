import React from 'react';

import TagFilter from 'in-analyze/Analyze/components/TagFilter';
import AddButton from 'in-analyze/Analyze/components/AddButton';

import locals from './TagFilterList.mless';

export default function TagFilterList({
  onAddTagFilter,
  tagFilters,
  withApplicationOptions,
  filterConnectionOperator = 'AND'
}) {
  return (
    <div className={locals.tagFilterListWrapper}>
      <ul className={locals.tagFilterList}>
        {tagFilters.map((tagFilter, i) => (
          <li key={i} className={locals.item}>
            <TagFilter
              tagFilter={tagFilter}
              isFirstOperator={i === 0}
              isLastOperator={i === tagFilters.length - 1}
              filterConnectionOperator={filterConnectionOperator}
              isOnlyFilter={tagFilters.length === 1}
            />
          </li>
        ))}
      </ul>

      <div className={locals.buttonWrapper}>
        <AddButton
          text="Add filter"
          onClick={option => onAddTagFilter(option)}
          withApplicationOptions={withApplicationOptions}
          tagFilters={tagFilters}
        />
      </div>
    </div>
  );
}
