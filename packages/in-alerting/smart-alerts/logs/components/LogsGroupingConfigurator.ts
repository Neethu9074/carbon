/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable, just } from '@instana/observables';

import { GetLogSuggestionsProps } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
//@ts-expect-error needs TS migration
import { createGroupingConfigurator } from 'in-components/GroupingConfigurator';
import getTagSuggestions from 'in-logging/subscriptions/getTagSuggestions';
import { Result, CatalogUseCase, TagSuggestions } from 'in-types';
import { getTagCatalog } from 'in-logging/api/catalog';
import { listSuccess } from 'in-services/util/result';

const { GroupingConfigurator, isGroupingConfigurationValid: isGroupingConfigurationValidInternal } =
  createGroupingConfigurator({
    //@ts-expect-error TODO : remove this when type definition gets updated.
    getTagCatalog: () => getTagCatalog({ useCase: 'SMART_ALERTS_GROUPING' }),
    getSuggestions: (params: GetLogSuggestionsProps) => {
      const { tagFilterExpression, name: tagName, timeConfig, propose, key } = params;
      return getTagCatalog({ useCase: 'TAG_SUGGESTIONS' as CatalogUseCase }).flatMap(
        tagCatalog =>
          (tagCatalog.data?.tags.map(({ name }) => name).includes(tagName)
            ? getTagSuggestions({
                timeConfig,
                tagName,
                tagFilterExpression,
                propose,
                key
              })
            : just(listSuccess([]))) as Observable<Result<TagSuggestions>>
      );
    }
  });

export default GroupingConfigurator;

export const isGroupingConfigurationValid = isGroupingConfigurationValidInternal;
