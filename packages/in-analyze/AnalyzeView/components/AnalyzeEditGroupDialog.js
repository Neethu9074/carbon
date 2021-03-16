/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import EditGroupDialog from 'in-analyze/components/EditGroupDialog/EditGroupDialog';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { mapDataHO, noResultObservable } from 'in-services/util/result';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { t } from 'in-i18n';

const mapResultData = mapDataHO(data => data.suggestions);

export default function AnalyzeEditDialog(props) {
  const { filters, tagFilters, timeConfig } = props;

  const tagSuggestions = getConfigByDataSource(filters.dataSource).groupTagKeys;
  const help = t('in-analyze:analyzeView.analyzeEditGroupHelp');
  const getKeySuggestions = getSecondLevelKeySuggestions(tagFilters, timeConfig);

  return (
    <EditGroupDialog {...props} tagSuggestions={tagSuggestions} help={help} getKeySuggestions={getKeySuggestions} />
  );
}

function getSecondLevelKeySuggestions(tagFilters, timeConfig) {
  return ({ form }) => {
    if (isMissingInForm(form, 'tag')) {
      return noResultObservable();
    }

    const key = form.get('tag').value;
    return getTagSuggestions({
      filter: {
        timeConfig
      },
      tagFilters: getTagFilterListForBackendSubscription(tagFilters),
      tagName: key,
      secondLevelKeyTagName: null,
      valueFilter: null
    }).map(mapResultData);
  };
}

function isMissingInForm(form, attribute) {
  return !form.containsKey(attribute) || !form.get(attribute).value;
}
