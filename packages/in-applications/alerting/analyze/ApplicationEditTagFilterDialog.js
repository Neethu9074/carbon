import React from 'react';

import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { mapDataHO } from 'in-services/util/result';

const mapResultData = mapDataHO(data => data.suggestions);

export default function ApplicationEditTagFilterDialog(props) {
  return (
    <EditTagFilterDialog {...props} getKeySuggestions={getKeySuggestions} getValueSuggestions={getValueSuggestions} />
  );
}

function getKeySuggestions({ timeConfig, tagFilters, tag }) {
  return getTagSuggestions({
    filter: {
      timeConfig
    },
    tagFilters: getTagFilterListForBackendSubscription(tagFilters),
    tagName: tag,
    secondLevelKeyTagName: null,
    valueFilter: null
  }).map(mapResultData);
}

function getValueSuggestions({ timeConfig, tagFilters, tag, key }) {
  return getTagSuggestions({
    filter: {
      timeConfig
    },
    tagFilters: getTagFilterListForBackendSubscription(tagFilters),
    tagName: key ?? tag,
    secondLevelKeyTagName: null,
    valueFilter: null
  }).map(mapResultData);
}
