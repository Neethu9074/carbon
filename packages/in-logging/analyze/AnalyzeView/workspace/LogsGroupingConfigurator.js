/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createGroupingConfigurator } from 'in-components/GroupingConfigurator';
import { getTagCatalog } from 'in-logging/api/catalog';

const {
  GroupingConfigurator,
  isGroupingConfigurationValid: isGroupingConfigurationValidInternal
} = createGroupingConfigurator({
  getTagCatalog: () => getTagCatalog({ useCase: 'GROUPING' }),
  getSuggestions: () => {}
});

export default GroupingConfigurator;

export const isGroupingConfigurationValid = isGroupingConfigurationValidInternal;
