/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CatalogUseCase, Result, TagSuggestions } from '@instana/types';
import { just, Observable } from '@instana/observables';

//@ts-expect-error needs TS migration
import { createGroupingConfigurator } from 'in-components/GroupingConfigurator';
import getTagSuggestions from 'in-logging/subscriptions/getTagSuggestions';
import { getTagCatalog } from 'in-logging/api/catalog';
import { listSuccess } from 'in-services/util/result';

const { GroupingConfigurator, isGroupingConfigurationValid: isGroupingConfigurationValidInternal } =
  createGroupingConfigurator({
    getTagCatalog: () => getTagCatalog({ useCase: 'GROUPING' }),
    getSuggestions: (params: any) => {
      const { tagFilterExpression, name: tagName, timeConfig, propose, key } = params;
      const result = getTagCatalog({ useCase: 'TAG_SUGGESTIONS' as CatalogUseCase }).flatMap(tagCatalog => {
        return (
          tagCatalog.data?.tags.map(({ name }) => name).includes(tagName)
            ? getTagSuggestions({
                timeConfig,
                tagName,
                tagFilterExpression,
                propose,
                key
              })
            : just(listSuccess([]))
        ) as Observable<Result<TagSuggestions>>;
      });
      return result;
    }
  });
export default GroupingConfigurator;

export const isGroupingConfigurationValid = isGroupingConfigurationValidInternal;
