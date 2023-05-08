/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';

import { GetSuggestionsProps, Suggestions } from 'in-websites/queryBuilder';
import { GetTagSuggestionsProps } from 'in-components/QueryBuilder';
import { Result, TagCatalog, TagSuggestions } from 'in-types';

export function createTagBasedPayloadConfigurator({
  getTagCatalog,
  getSuggestions
}: {
  getTagCatalog: () => Observable<Result<TagCatalog>>;
  getSuggestions?: (
    args: GetTagSuggestionsProps | GetSuggestionsProps
  ) => Observable<Result<TagSuggestions | Suggestions>>;
});

export function createTagBasedApplicationPayloadConfigurator({
  getTagCatalog,
  getSuggestions
}: {
  getTagCatalog: () => Observable<Result<TagCatalog>>;
  getSuggestions?: (args: GetTagSuggestionsProps) => Observable<Result<TagSuggestions>>;
});

export function createTagBasedWebsitePayloadConfigurator({
  getTagCatalog,
  getSuggestions
}: {
  getTagCatalog: () => Observable<Result<TagCatalog>>;
  getSuggestions?: (args: GetSuggestionsProps) => Observable<Result<Suggestions>>;
});

interface TagNodeLike {
  type?: string;
}

export function doesTagNodeNeedSecondLevelKey(tagNode: TagNodeLike): boolean;

interface ViewModel {
  tagName: string;
  secondLevelKey: string;
}

export const toViewModel = ({ tagName = '', key }: DynamicFieldValue) => ViewModel;
