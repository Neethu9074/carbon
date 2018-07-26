import { compose } from 'recompose';
import React from 'react';

import SearchableList from 'in-analyze/Analyze/components/QuickFilter/SearchableList';
import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { getTagFromList } from 'in-applications/tags';
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

function getTagFilterList(tagName, filters) {
  const tagFilters = [];

  const tagFilter = filters.get('tagFilter').toJS();

  let application = getTagFromList(tagFilter, { name: APPLICATION.name });
  let service = getTagFromList(tagFilter, { name: SERVICE.name });
  let endpoint = getTagFromList(tagFilter, { name: ENDPOINT.name });

  const isApplicationTag = tagName !== APPLICATION.name;
  const isServiceTag = tagName !== SERVICE.name;
  const isEndpointTag = tagName !== ENDPOINT.name;

  if (application && isApplicationTag) {
    tagFilters.push({ name: APPLICATION.technicalName, stringValue: application.value });
  }
  if (service && (isApplicationTag && isServiceTag)) {
    tagFilters.push({ name: SERVICE.technicalName, stringValue: service.value });
  }
  if (endpoint && (isApplicationTag && isServiceTag && isEndpointTag)) {
    tagFilters.push({ name: ENDPOINT.technicalName, stringValue: endpoint.value });
  }

  return tagFilters;
}
