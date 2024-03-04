/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { just, Observable } from '@instana/observables';

import getTagSuggestions from 'in-logging/subscriptions/getTagSuggestions';
import { CatalogUseCase, Result, TagSuggestions } from 'in-types';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { getTagCatalog } from 'in-logging/api/catalog';
import { listSuccess } from 'in-services/util/result';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog: () => getTagCatalog({ useCase: 'SMART_ALERTS' }),
  getSuggestions: params => {
    const { tagFilterExpression, tagName, timeConfig, propose } = params;
    return getTagCatalog({ useCase: 'TAG_SUGGESTIONS' as CatalogUseCase }).flatMap(
      tagCatalog =>
        (tagCatalog.data?.tags.map(({ name }) => name).includes(tagName)
          ? getTagSuggestions({
              timeConfig,
              tagName,
              tagFilterExpression,
              propose
            })
          : just(listSuccess([]))) as Observable<Result<TagSuggestions>>
    );
  }
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
