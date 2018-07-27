import { compose } from 'recompose';
import React from 'react';

import SearchableList from 'in-analyze/Analyze/components/QuickFilter/SearchableList';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getTagFilterList } from 'in-analyze/Dialogs/withTagSuggestions';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(({ filters, tagName }) => ({
    tagValueSuggestions: getTagSuggestions({
      filter: {
        timeConfig: filters.get('timeConfig')
      },
      tagFilters: getTagFilterList(tagName, filters),
      tagName,
      secondLevelKeyTagName: null,
      requestingSecondaryKeySuggestions: false,
      valueFilter: null
    })
      .startWith(null)
      .map(getEndpointTypesComboBoxItems)
  }))
)(ApplicationServiceEndpointSuggestions);

function ApplicationServiceEndpointSuggestions(props) {
  let { icon, tagValueSuggestions } = props;

  if (tagValueSuggestions) {
    tagValueSuggestions = tagValueSuggestions.map(suggestion => ({ label: suggestion, icon }));
  }

  return <SearchableList {...props} items={tagValueSuggestions} />;
}

function getEndpointTypesComboBoxItems(autoCompletedValuesResult) {
  if (!autoCompletedValuesResult || !autoCompletedValuesResult.data) {
    return null;
  }

  if (autoCompletedValuesResult.errors.length > 0) {
    return [];
  }

  return autoCompletedValuesResult.data.suggestions;
}
