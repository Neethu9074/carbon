/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GroupingConfigurator from 'in-components/GroupingConfigurator/GroupingConfigurator';
import { isValid } from 'in-components/GroupingConfigurator/validation';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { success } from 'in-services/util/result';

export function createGroupingConfigurator({ getTagCatalog: originalGetTagCatalog, getSuggestions }) {
  const getTagCatalog = getTagCatalogOnce(originalGetTagCatalog);

  const { GroupingConfigurator, isGroupingConfigurationValid } = createDynamicGroupingConfigurator({ getSuggestions });

  return {
    getTagCatalog,
    GroupingConfigurator: function CreatedGroupingConfigurator(props) {
      const tagCatalog = useTagCatalog(getTagCatalog);
      return <GroupingConfigurator {...props} tagCatalog={tagCatalog} />;
    },

    // Observable<Result<Boolean>>
    isGroupingConfigurationValid: (groupingConfiguration, timeConfig) =>
      getTagCatalog({ timeConfig })
        .map(result => isGroupingConfigurationValid(groupingConfiguration, result))
  };
}

export function createDynamicGroupingConfigurator({ getSuggestions }) {
  return {
    GroupingConfigurator: function CreatedGroupingConfigurator({ tagCatalog, ...props }) {
      return <GroupingConfigurator {...props} tagCatalog={tagCatalog} getSuggestions={getSuggestions} />;
    },

    isGroupingConfigurationValid: (groupingConfiguration, result) => {
      if (!result?.data) {
        return result;
      }
      return success(isValid(groupingConfiguration, result?.data));
    }
  }
}
