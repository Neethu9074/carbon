import React from 'react';

import GroupingConfigurator from 'in-new-components/GroupingConfigurator/GroupingConfigurator';
import { isValid } from 'in-new-components/GroupingConfigurator/validation';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { success } from 'in-services/util/result';

export function createGroupingConfigurator({ getTagCatalog: originalGetTagCatalog, getSuggestions }) {
  const getTagCatalog = getTagCatalogOnce(originalGetTagCatalog);

  return {
    getTagCatalog,

    GroupingConfigurator: function CreatedGroupingConfigurator(props) {
      return <GroupingConfigurator {...props} getTagCatalog={getTagCatalog} getSuggestions={getSuggestions} />;
    },

    // Observable<Result<Boolean>>
    isGroupingConfigurationValid: (groupingConfiguration, timeConfig) =>
      getTagCatalog({ timeConfig }).map(result => {
        if (!result.data) {
          return result;
        }
        return success(isValid(groupingConfiguration, result.data));
      })
  };
}
