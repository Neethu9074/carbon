/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CatalogUseCase, Result, TagSuggestions } from '@instana/types';
import { just, Observable } from '@instana/observables';

import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import getTagSuggestions from 'in-logging/subscriptions/getTagSuggestions';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { getTagCatalog } from 'in-logging/api/catalog';
import { listSuccess } from 'in-services/util/result';

interface AdditionalTagSuggestionProps {
  formModelWithFacets: FormModelElement[];
}

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder<AdditionalTagSuggestionProps>({
  getTagCatalog,
  getSuggestions: params => {
    const { formModelWithFacets, tagName, timeConfig, propose, key } = params;
    return getTagCatalog({ useCase: 'TAG_SUGGESTIONS' as CatalogUseCase }).flatMap(
      tagCatalog =>
        (tagCatalog.data?.tags.map(({ name }) => name).includes(tagName)
          ? getTagSuggestions({
              timeConfig,
              tagName,
              tagFilterExpression: toBackendQueryModel(formModelWithFacets),
              propose,
              key
            })
          : just(listSuccess([]))) as Observable<Result<TagSuggestions>>
    );
  }
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
