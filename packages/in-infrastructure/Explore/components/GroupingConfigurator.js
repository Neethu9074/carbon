/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getTagValueSuggestions from 'in-infrastructure/Explore/services/getTagValueSuggestions';
import { createDynamicGroupingConfigurator } from 'in-components/GroupingConfigurator';

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createDynamicGroupingConfigurator({
  getSuggestions: getTagValueSuggestions
});

export default GroupingConfigurator;

export const isGroupingConfigurationValid = isGroupingConfigurationValidInternal;
