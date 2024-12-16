/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just, Observable } from '@instana/observables';

import getTagSuggestions from 'in-logging/subscriptions/getTagSuggestions';
import { CatalogUseCase, Result, TagSuggestions } from 'in-types';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { getTagCatalog } from 'in-logging/api/catalog';
import { listSuccess } from 'in-services/util/result';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog,
  getSuggestions: params => {
    const { tagFilterExpression, tagName, timeConfig, propose, key } = params;
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

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
