import React, { useState } from 'react';

import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';
import ExistingValue, { existingValuesForTag } from './ExistingValue';
import SearchInput from 'in-new-components/SearchInput/SearchInput';
import SuggestionsPresenter from './SuggestionsPresenter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

import locals from './FacetedFilterGeneric.mless';

export default function FacetedFilterGeneric({ title, tag, tagFilterExpression, addFilter }) {
  const [valueFilter, setValueFilter] = useState('');
  const selectedValues = existingValuesForTag(tag, tagFilterExpression);
  return (
    <ExpandableCard title={title} useMaxAvailableHeight={false} framed={false} className={locals.facetedCard} size="s">
      {selectedValues.length > 0 ? (
        selectedValues.map((value, i) => <ExistingValue key={i} value={value} tag={tag} />)
      ) : (
        <>
          <SearchInput onChange={setValueFilter} query={valueFilter} />
          <Suggestions
            tag={tag}
            valueFilter={valueFilter}
            tagFilterExpression={tagFilterExpression}
            addFilter={addFilter}
          />
        </>
      )}
    </ExpandableCard>
  );
}

function Suggestions({ valueFilter, tag, tagFilterExpression, addFilter }) {
  const timeConfig = useTimeConfig();
  const suggestions = useObservable(
    getTagSuggestions({
      tagFilterExpression,
      valueFilter,
      tagName: tag,
      filter: {
        timeConfig: timeConfig
      },
      filterOnTagName: true
    }),
    [tagFilterExpression, valueFilter]
  );
  return (
    <SuggestionsPresenter
      loading={suggestions?.progress.loading}
      errors={suggestions?.errors}
      suggestions={suggestions?.data?.suggestions}
      addFilter={addFilter}
      tag={tag}
    />
  );
}
