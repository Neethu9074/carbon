import { withProps } from 'recompose';

import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { mapDataHO, noResultObservable } from 'in-services/util/result';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';

export default withProps(props => {
  const { filters, addTagFilter, setTagFilters, filterChangedTracker, filterRemovedTracker } = props;
  const dataSourceConfig = getConfigByDataSource(filters.get('dataSource'));
  const tagFilters = filters.get('tagFilter').toJS();
  const timeConfig = filters.get('timeConfig');
  const filterTagKeys = dataSourceConfig.filterTagKeys;

  return {
    tagFilters,
    timeConfig,
    filterSuggestionsClientSide: true,
    tagSuggestions: filterTagKeys,
    getKeySuggestions: getSecondLevelKeySuggestions(tagFilters, timeConfig),
    getValueSuggestions: getValueSuggestions(tagFilters, timeConfig),
    addTagFilter: addTagFilter,
    setTagFilters: setTagFilters,
    filterChangedTracker: filterChangedTracker,
    filterRemovedTracker: filterRemovedTracker
  };
})(EditTagFilterDialog);

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

function getValueSuggestions(tagFilters, timeConfig) {
  return ({ form }) => {
    if (isMissingInForm(form, 'tag') || isRequiredButMissingInForm(form, 'key')) {
      return noResultObservable();
    }

    const tagName = form.get('tag').value;
    const secondLevelKeyTagName = form.containsKey('key') ? form.get('key').value : null;
    return getTagSuggestions({
      filter: {
        timeConfig
      },
      tagFilters: getTagFilterListForBackendSubscription(tagFilters),
      tagName,
      secondLevelKeyTagName,
      valueFilter: null
    }).map(mapResultData);
  };
}

const mapResultData = mapDataHO(data => data.suggestions);

function isMissingInForm(form, attribute) {
  return !form.containsKey(attribute) || !form.get(attribute).value;
}

function isRequiredButMissingInForm(form, attribute) {
  return form.containsKey(attribute) && !form.get(attribute).value;
}
