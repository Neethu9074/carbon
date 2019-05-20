import { withProps } from 'recompose';

import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import EditGroupDialog from 'in-analyze/components/EditGroupDialog/EditGroupDialog';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { mapDataHO, noResultObservable } from 'in-services/util/result';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';

const mapResultData = mapDataHO(data => data.suggestions);

export default withProps(({ filters, tagFilters, timeConfig }) => {
  const tagSuggestions = getConfigByDataSource(filters.dataSource).groupTagKeys;
  return {
    help: 'Select a tag by which calls and traces should be grouped.',
    getKeySuggestions: getSecondLevelKeySuggestions(tagFilters, timeConfig),
    tagSuggestions
  };
})(EditGroupDialog);

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
