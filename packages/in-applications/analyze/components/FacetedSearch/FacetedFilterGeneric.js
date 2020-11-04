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

export default function FacetedFilterGeneric({ title, tagFilterExpression, tag, entity, updateFilter }) {
  return (
    <FacetedExpandableCard title={title}>
      <Body tagFilterExpression={tagFilterExpression} tag={tag} entity={entity} updateFilter={updateFilter} />
    </FacetedExpandableCard>
  );
}

function Body({ tagFilterExpression, tag, entity, title, updateFilter }) {
  const [valueFilter, setValueFilter] = useState('');
  const selectedValues = existingValuesForTag(tagFilterExpression, tag, entity);
  if (selectedValues.length > 0) {
    return (
      <ExistingFilters
        title={title}
        selectedValues={selectedValues}
        remove={value =>
          updateFilter({
            remove: [
              {
                type: TAG,
                name: tag,
                operator: EQUALS,
                value,
                ...(entity && { entity })
              }
            ]
          })
        }
      />
    );
  }
  return (
    <SearchAndSuggestions
      tagFilterExpression={tagFilterExpression}
      tag={tag}
      updateFilter={updateFilter}
      valueFilter={valueFilter}
      setValueFilter={setValueFilter}
    />
  );
}

function ExistingFilters({ selectedValues, remove }) {
  return (
    <>
      {selectedValues.map((value, i) => (
        <ExistingValue key={i} value={value} remove={() => remove(value)} />
      ))}
    </>
  );
}

function SearchAndSuggestions({ tagFilterExpression, tag, updateFilter, valueFilter, setValueFilter }) {
  return (
    <>
      <SearchInput onChange={setValueFilter} query={valueFilter} className={locals.search} withoutIcon />
      <Suggestions
        tag={tag}
        valueFilter={valueFilter}
        tagFilterExpression={tagFilterExpression}
        updateFilter={updateFilter}
      />
    </>
  );
}

function Suggestions({ tagFilterExpression, tag, updateFilter, valueFilter }) {
  const timeConfig = useTimeConfig();
  const suggestions = useObservable(
    getTagSuggestions({
      tagFilterExpression,
      valueFilter,
      tagName: tag,
      filter: {
        timeConfig: timeConfig
      },
      filterOnTagName: true,
      metrics: {
        calls_SUM_Agg: {
          metric: 'calls',
          aggregation: 'SUM'
        }
      }
    }),
    [tagFilterExpression, valueFilter]
  );
  return (
    <SuggestionsPresenter
      loading={suggestions?.progress.loading}
      errors={suggestions?.errors}
      suggestions={suggestions?.data?.results}
      updateFilter={updateFilter}
      tag={tag}
    />
  );
}
