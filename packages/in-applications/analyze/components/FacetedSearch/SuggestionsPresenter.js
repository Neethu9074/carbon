import React, { useState } from 'react';

import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';
import { sortBy } from 'lodash';

import locals from './Suggestion.mless';

const DEFAULT_SUGGESTIONS_SIZE = 5;

export default function SuggestionsPresenter({ loading = false, errors = [], suggestions = [], tag, updateFilter }) {
  if (loading) {
    return <Loading />;
  } else if (errors?.length > 0) {
    return <Errors errors={errors} />;
  } else if (!suggestions) {
    return null;
  } else if (suggestions.length > 0) {
    return <Results suggestions={suggestions} tag={tag} updateFilter={updateFilter} />;
  } else {
    return <NoResults />;
  }
}

function Loading() {
  return (
    <div className={locals.loading}>
      <InfiniteCircle width={72} height={24} />
    </div>
  );
}

function Errors({ errors }) {
  return (
    <>
      {errors.map(error => (
        <Message key={error.code} className={locals.message} type="error" small>
          {error.message}
        </Message>
      ))}
    </>
  );
}

function Results({ suggestions, tag, updateFilter }) {
  const [showMore, setShowMore] = useState(true);
  return (
    <>
      {sortBy(suggestions, suggestion => -1 * suggestion.metrics.calls_SUM_Agg[0][1])
        .slice(0, showMore ? DEFAULT_SUGGESTIONS_SIZE : undefined)
        .map((suggestion, i) => (
          <div key={i} className={locals.suggestion}>
            <Tooltip content={suggestion.label}>
              <Link
                onClick={() =>
                  updateFilter({
                    add: [
                      {
                        type: TAG,
                        name: tag,
                        operator: EQUALS,
                        value: suggestion.label
                      }
                    ]
                  })
                }
                className={locals.addSuggestion}
              >
                <span className={locals.label}>{suggestion.label}</span>
                <span className={locals.count}>{suggestion.metrics.calls_SUM_Agg[0][1]}</span>
              </Link>
            </Tooltip>
          </div>
        ))}
      {showMore && suggestions.length > DEFAULT_SUGGESTIONS_SIZE && (
        <Button className={locals.showMore} kind="action" onClick={() => setShowMore(false)}>
          show {suggestions.length - DEFAULT_SUGGESTIONS_SIZE} more
        </Button>
      )}
    </>
  );
}

function NoResults() {
  return <div className={locals.noResult}>No results</div>;
}
