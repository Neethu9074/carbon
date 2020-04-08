import { withProps } from 'recompose';

import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { mapDataHO } from 'in-services/util/result';

const mapResultData = mapDataHO(data => data.suggestions);

export default withProps({
  getKeySuggestions: ({ timeConfig, tagFilters, tag }) => {
    return getTagSuggestions({
      filter: {
        timeConfig
      },
      tagFilters: getTagFilterListForBackendSubscription(tagFilters),
      tagName: tag,
      secondLevelKeyTagName: null,
      valueFilter: null
    }).map(mapResultData);
  },
  getValueSuggestions: ({ timeConfig, tagFilters, tag, key }) => {
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
})(EditTagFilterDialog);
