import React from 'react';

import TagFilter from 'in-analyze/AnalyzeView/components/TagFilter';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './TagFilterList.mless';

export default function TagFilterList({ tagFilters, filterConnectionOperators = ['AND'], onOperatorChanged }) {
  const shouldAddSpaceBetweenFilterGroups = containsAndConjunction(tagFilters);

  return (
    <div className={locals.tagFilterListWrapper}>
      <ul className={locals.tagFilterList}>
        {tagFilters.map((tagFilter, i) => (
          <li
            key={i}
            className={evaluateClassNames({
              [locals.item]: true,
              [locals.extraMargin]: shouldAddSpaceBetweenFilterGroups && tagFilter.tag.conjunction === 'OR'
            })}
          >
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

function containsAndConjunction(tagFilters) {
  // the last item always has an AND, so skip it
  for (let i = 0; i < tagFilters.length - 1; i++) {
    if (tagFilters[i].tag.conjunction === 'AND') {
      return true;
    }
  }
  return false;
}
