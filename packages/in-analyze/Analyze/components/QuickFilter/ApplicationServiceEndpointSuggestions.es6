import { compose } from 'recompose';
import React from 'react';

import SearchableList from 'in-analyze/Analyze/components/QuickFilter/SearchableList';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(({ filters, tagName }) => ({
    tagValueSuggestions: getTagSuggestions({
      filter: {
        timeConfig: filters.get('timeConfig')
      },
      tagFilters: getTagFilterListForBackendSubscription(filters.get('tagFilter').toJS()),
      tagName,
      secondLevelKeyTagName: null,
      valueFilter: null
    })
      .startWith(null)
      .map(getTagSuggestionItems)
  }))
)(ApplicationServiceEndpointSuggestions);

function ApplicationServiceEndpointSuggestions(props) {
  let { icon, tagValueSuggestions } = props;

  if (tagValueSuggestions) {
    tagValueSuggestions = tagValueSuggestions.map(suggestion => ({ value: suggestion, label: suggestion, icon }));
  }

  return <SearchableList {...props} items={tagValueSuggestions} />;
}

function getTagSuggestionItems(tagSuggestionResult) {
  if (!tagSuggestionResult) {
    return null;
  }

  if (tagSuggestionResult.errors.length > 0) {
    return [];
  }

  if (!tagSuggestionResult.data) {
    return null;
  }

  return tagSuggestionResult.data.suggestions;
}
