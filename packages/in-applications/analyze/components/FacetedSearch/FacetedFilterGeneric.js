import React, { useState } from 'react';

import { EXPRESSION, OPERATOR_AND } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import SearchInput from 'in-new-components/SearchInput/SearchInput';
import { evaluateClassNames } from 'in-services/util/classnames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

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
          <SearchInput onChange={setValueFilter} query={valueFilter} className={locals.facetedSearchBar} />
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

function ExistingValue({ value, tag }) {
  return (
    <div className={locals.suggestion}>
      <Tooltip content={value}>
        <span className={locals.label}>{value}</span>
      </Tooltip>
      <SvgIcon
        type="lib_openclose_cancel"
        className={evaluateClassNames({
          [locals.dismiss]: true,
          [locals.smallSize]: true
        })}
        onClick={() => alert('removing filter on ' + tag + ' = ' + value)}
        size="s"
      />
    </div>
  );
}

function existingValuesForTag(tag, tagFilterExpression) {
  const singleFilterValue =
    tagFilterExpression.type === TAG_FILTER_TYPE &&
    tagFilterExpression.name === tag &&
    tagFilterExpression.operator === EQUALS &&
    tagFilterExpression.value !== null &&
    tagFilterExpression.value;
  if (singleFilterValue) {
    return [singleFilterValue];
  }
  return (
    tagFilterExpression.type === EXPRESSION &&
    tagFilterExpression.logicalOperator === OPERATOR_AND &&
    tagFilterExpression.elements
      .filter(element => element.type === TAG_FILTER_TYPE && element.name === tag && element.operator === EQUALS)
      .map(element => element.value)
      .filter(value => value != null)
  );
}

function Suggestions({ valueFilter, tag, tagFilterExpression, addFilter }) {
  const [showMore, setShowMore] = useState(true);
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
  const displayedSuggestions = suggestions?.data?.suggestions.slice(0, showMore ? 5 : undefined);
  return (
    <>
      {displayedSuggestions?.map((suggestion, i) => (
        <div key={i} className={locals.suggestion}>
          <Tooltip content={suggestion}>
            <Link
              onClick={() =>
                addFilter({
                  type: TAG,
                  name: tag,
                  operator: EQUALS,
                  value: suggestion
                })
              }
              className={locals.label}
            >
              {suggestion}
            </Link>
          </Tooltip>
        </div>
      ))}
      {showMore && suggestions?.data?.suggestions.length > 5 && (
        <Button className={locals.showMore} kind="action" onClick={() => setShowMore(false)}>
          show {suggestions?.data?.suggestions.length - 5} more
        </Button>
      )}
      {displayedSuggestions?.length === 0 && <div className={locals.noResult}>No results</div>}
    </>
  );
}
