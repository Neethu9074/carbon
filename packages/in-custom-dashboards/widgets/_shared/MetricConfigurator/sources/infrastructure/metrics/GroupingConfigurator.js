/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTagValueSuggestions from 'in-infrastructure/Explore/services/getTagValueSuggestions';
import { createGroupingConfigurator } from 'in-components/GroupingConfigurator';
import getTagCatalog from 'in-infrastructure/subscriptions/getTagCatalog';

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: props => getTagCatalog({ includeMetricTags: true, ...props }),
  getSuggestions: getTagValueSuggestions
});

export default GroupingConfigurator;

export const isGroupingConfigurationValid = isGroupingConfigurationValidInternal;
