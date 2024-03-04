/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

//@ts-expect-error needs TS migration
import { createGroupingConfigurator } from 'in-components/GroupingConfigurator';
import { getTagCatalog } from 'in-logging/api/catalog';

const { GroupingConfigurator, isGroupingConfigurationValid: isGroupingConfigurationValidInternal } =
  createGroupingConfigurator({
    //@ts-expect-error TODO : remove this when type definition gets updated.
    getTagCatalog: () => getTagCatalog({ useCase: 'SMART_ALERTS_GROUPING' }),
    getSuggestions: () => {}
  });

export default GroupingConfigurator;

export const isGroupingConfigurationValid = isGroupingConfigurationValidInternal;
