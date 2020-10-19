import React, { useState } from 'react';

import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import ExistingValue, { existingValuesForTag } from './ExistingValue';
import SearchInput from 'in-new-components/SearchInput/SearchInput';
import SuggestionsPresenter from './SuggestionsPresenter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

import locals from './Suggestion.mless';

export default function FacetedFilterGeneric({ title, tagFilterExpression, tag, entity, addFilter, removeFilter }) {
  const [valueFilter, setValueFilter] = useState('');
  const selectedValues = existingValuesForTag(tagFilterExpression, tag, entity);
  if (selectedValues.length > 0) {
    return (
      <ExistingFilters
        title={title}
        selectedValues={selectedValues}
        remove={value =>
          removeFilter({
            type: TAG,
            name: tag,
            operator: EQUALS,
            value,
            ...(entity && { entity })
          })
        }
      />
    );
  }
  return (
    <FacetedExpandableCard title={title}>
      <SearchInput onChange={setValueFilter} query={valueFilter} className={locals.search} />
      <Suggestions
        tag={tag}
        valueFilter={valueFilter}
        tagFilterExpression={tagFilterExpression}
        addFilter={addFilter}
      />
    </FacetedExpandableCard>
  );
}

function ExistingFilters({ title, selectedValues, remove }) {
  return (
    <FacetedExpandableCard title={title} openByDefault>
      {selectedValues.map((value, i) => (
        <ExistingValue key={i} value={value} remove={() => remove(value)} />
      ))}
    </FacetedExpandableCard>
  );
}

function Suggestions({ tagFilterExpression, tag, addFilter, valueFilter }) {
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
