import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import SearchableList from 'in-analyze/AnalyzeView/components/QuickFilter/SearchableList';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(({ filters, tagName }) => ({
    tagSuggestionResult: getTagSuggestions({
      filter: {
        timeConfig: filters.get('timeConfig')
      },
      tagFilters: getTagFilterListForBackendSubscription(filters.get('tagFilter').toJS()),
      tagName,
      secondLevelKeyTagName: null,
      valueFilter: null
    }).startWith(null)
  }))
)(ApplicationServiceEndpointSuggestions);

function ApplicationServiceEndpointSuggestions(props) {
  let { icon, tagSuggestionResult } = props;

  if (tagSuggestionResult) {
    const error = get(tagSuggestionResult, ['errors', 'length']) > 0;
    const loading = get(tagSuggestionResult, ['progress', 'loading'], false);
    const tagSuggestions = get(tagSuggestionResult, ['data', 'suggestions'], []).map(suggestion => ({
      value: suggestion,
      label: suggestion,
      icon
    }));

    return <SearchableList {...props} error={error} loading={loading} items={tagSuggestions} />;
  }
}
