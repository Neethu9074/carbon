import React from 'react';

import TagFilter from 'in-analyze/AnalyzeView/components/TagFilter';

import locals from './TagFilterList.mless';

export default function TagFilterList({ tagFilters, filterConnectionOperators = ['AND'], onOperatorChanged }) {
  return (
    <div className={locals.tagFilterListWrapper}>
      <ul className={locals.tagFilterList}>
        {tagFilters.map((tagFilter, i) => (
          <li key={i} className={locals.item}>
            <TagFilter
              tagFilter={tagFilter}
              isFirstOperator={i === 0}
              isLastOperator={i === tagFilters.length - 1}
              filterConnectionOperators={filterConnectionOperators}
              onOperatorChanged={operator => onOperatorChanged(i, operator)}
              isOnlyFilter={tagFilters.length === 1}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
