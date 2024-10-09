/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTagValueSuggestions from 'in-infrastructure/Explore/services/getTagValueSuggestions';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createDynamicGroupingConfigurator } from 'in-components/GroupingConfigurator';
import getTagCatalog from 'in-infrastructure/Explore/services/getTagCatalog';

const { GroupingConfigurator, isGroupingConfigurationValid: isGroupingConfigurationValidInternal } =
  createDynamicGroupingConfigurator({
    getSuggestions: getTagValueSuggestions,
    getTagCatalog: ({ timeConfig, query, ownerType }) =>
      getTagCatalog({ filter: { timeConfig, tagFilterExpression: EMPTY_EXPRESSION }, ownerType, query, regex: false }),
    addTagDefinitionToFormModel: true,
    disableEntitySelection: true
  });

export default GroupingConfigurator;

export const isGroupingConfigurationValid = isGroupingConfigurationValidInternal;
