import React from 'react';

import KeyValueBarItemBehavior from 'in-new-components/filterBar/KeyValueBarItem/KeyValueBarItemBehavior';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { emptyArray } from 'in-services/fixedObjects';
import { just } from 'reactive-observables';

export default function AnalyzeMoreBarItem(props) {
  const { filters, addTagFilter, setTagFilters } = props;
  const dataSourceConfig = getConfigByDataSource(filters.get('dataSource'));
  const tagFilters = filters.get('tagFilter').toJS();

  return (
    <KeyValueBarItemBehavior
      label="More"
      tagFilters={tagFilters}
      getKeySuggestions={staticArrayResultObservableFn(dataSourceConfig.filterTagKeys)}
      getSecondLevelKeySuggestions={getSecondLevelKeySuggestions(tagFilters, filters.get('timeConfig'))}
      getValueSuggestions={getValueSuggestions(tagFilters, filters.get('timeConfig'))}
      addTagFilter={addTagFilter}
      setTagFilters={setTagFilters}
    />
  );
}

function getSecondLevelKeySuggestions(tagFilters, timeConfig) {
  return ({ form }) => {
    if (isMissingInForm(form, 'key')) {
      return noResult();
    }

    const key = form.get('key').value;
    return getTagSuggestions({
      filter: {
        timeConfig
      },
      tagFilters: getTagFilterListForBackendSubscription(tagFilters),
      tagName: key,
      secondLevelKeyTagName: null,
      valueFilter: null
    }).map(result => (result.data ? { ...result, data: result.data.suggestions } : result));
  };
}

function getValueSuggestions(tagFilters, timeConfig) {
  return ({ form }) => {
    if (isMissingInForm(form, 'key') || isRequiredButMissingInForm(form, 'secondLevelName')) {
      return noResult();
    }

    const key = form.get('key').value;
    const secondLevelKey = form.containsKey('secondLevelName') ? form.get('secondLevelName').value : null;
    return getTagSuggestions({
      filter: {
        timeConfig
      },
      tagFilters: getTagFilterListForBackendSubscription(tagFilters),
      tagName: key,
      secondLevelKeyTagName: secondLevelKey,
      valueFilter: null
    }).map(result => (result.data ? { ...result, data: result.data.suggestions } : result));
  };
}

function isMissingInForm(form, attribute) {
  return !form.containsKey(attribute) || !form.get(attribute).value;
}

function isRequiredButMissingInForm(form, attribute) {
  return form.containsKey(attribute) && !form.get(attribute).value;
}

function staticArrayResultObservableFn(values) {
  return () => staticArrayResultObservable(values);
}

function noResult() {
  return staticArrayResultObservable(emptyArray);
}

function staticArrayResultObservable(values) {
  return just({
    progress: { loading: false },
    errors: [],
    time: 0,
    data: values
  });
}
