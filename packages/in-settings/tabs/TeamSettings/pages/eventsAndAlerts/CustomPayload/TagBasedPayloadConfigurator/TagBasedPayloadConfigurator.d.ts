/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';

import { GetTagSuggestionsProps } from 'in-components/QueryBuilder';
import { Result, TagCatalog, TagSuggestions } from 'in-types';

export function createTagBasedPayloadConfigurator({
  getTagCatalog,
  getSuggestions
}: {
  getTagCatalog: () => Observable<Result<TagCatalog>>;
  getSuggestions?: (args: GetTagSuggestionsProps) => Observable<Result<TagSuggestions>>;
});

interface TagNodeLike {
  type?: string;
}

export function doesTagNodeNeedSecondLevelKey(tagNode: TagNodeLike): boolean;
