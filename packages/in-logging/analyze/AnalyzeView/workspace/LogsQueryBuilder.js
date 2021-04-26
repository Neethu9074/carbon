/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just } from '@instana/observables/lib';

import getTagSuggestions from 'in-logging/subscriptions/getTagSuggestions';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { getTagCatalog } from 'in-logging/api/catalog';
import { listSuccess } from 'in-services/util/result';

const { QueryBuilder, isQueryValid: isQueryValidInternal } = createQueryBuilder({
  getTagCatalog,
  getSuggestions: params => {
    const { tagFilterExpression, tagName, timeConfig, propose, key, value } = params;
    return getTagCatalog({ useCase: 'TAG_SUGGESTIONS' }).flatMap(tagCatalog =>
      tagCatalog.data?.tags.map(({ name }) => name).includes(tagName)
        ? getTagSuggestions({
            timeConfig,
            tagName,
            key,
            value,
            propose,
            tagFilterExpression
          })
        : just(listSuccess([]))
    );
  }
});

export default QueryBuilder;

export const isQueryValid = isQueryValidInternal;
