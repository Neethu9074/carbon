import { withProps } from 'recompose';

import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { mapDataHO, noResultObservable } from 'in-services/util/result';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { TAG_TYPES } from 'in-analyze/applicationFilter';

const mapResultData = mapDataHO(data => data.suggestions);

export default withProps(props => {
  const { filters, addTagFilter, setTagFilters, filterChangedTracker, filterRemovedTracker } = props;
  const dataSourceConfig = getConfigByDataSource(filters.dataSource);
  const tagFilters = filters.tagFilter;
  const timeConfig = filters.timeConfig;
  const filterTagKeys = dataSourceConfig.filterTagKeys;

  return {
    tagFilters,
    timeConfig,
    filterSuggestionsClientSide: true,
    tagSuggestions: filterTagKeys,
    getKeySuggestions: getSecondLevelKeySuggestions,
    getValueSuggestions: getValueSuggestions,
    addTagFilter: addTagFilter,
    setTagFilters: setTagFilters,
    filterChangedTracker: filterChangedTracker,
    filterRemovedTracker: filterRemovedTracker
  };
})(EditTagFilterDialog);

function getSecondLevelKeySuggestions({ tagFilters, timeConfig, form }) {
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
}

function getValueSuggestions({ tagFilters, timeConfig, form }) {
  if (isMissingInForm(form, 'tag') || isRequiredButMissingInForm(form, 'key')) {
    return noResultObservable();
  }
  const tagName = form.get('tag').value;
  const secondLevelKeyTagName = form.containsKey('key') ? form.get('key').value : null;

  const node = findSubTreeByFullyQualifiedName(tagName);
  if (
    !node ||
    node.type === TAG_TYPES.NUMBER.technicalName || // no value suggestion for number type tag
    node.type === TAG_TYPES.BOOLEAN.technicalName || // no value suggestion for boolean type tag
    node.name === 'trace.id' // no value suggestion for trace.id tag
  ) {
    return noResultObservable();
  }

  return getTagSuggestions({
    filter: {
      timeConfig
    },
    tagFilters: getTagFilterListForBackendSubscription(tagFilters),
    tagName,
    secondLevelKeyTagName,
    valueFilter: null
  }).map(mapResultData);
}

function isMissingInForm(form, attribute) {
  return !form.containsKey(attribute) || !form.get(attribute).value;
}

function isRequiredButMissingInForm(form, attribute) {
  return form.containsKey(attribute) && !form.get(attribute).value;
}
