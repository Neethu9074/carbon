/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ComponentType } from 'react';

import { Observable } from '@instana/observables';

import {
  Filter,
  TagCatalog,
  TagFilterEntity,
  TagFilterExpression,
  TagSuggestionProposeType,
  TagSuggestions,
  TimeConfig
} from 'in-types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

export type GetSuggestionsProps = { [key: string]: unknown };

export interface GetTagSuggestionsProps<ADDITIONAL_PROPS extends {} = {}> extends ADDITIONAL_PROPS {
  tagFilterExpression: TagFilterExpression;
  name: string;
  tagName: string;
  entity: TagFilterEntity;
  key: string;
  timeConfig: TimeConfig;
  propose: TagSuggestionProposeType;
  getSuggestionsProps?: GetSuggestionsProps;
  value?: any;
  filter?: Filter;
}

export interface GetTagCatalogProps<ADDITIONAL_PROPS extends {} = {}> extends ADDITIONAL_PROPS {
  timeConfig: TimeConfig;
  query?: string;
}

export type GetSuggestions<ADDITIONAL_TAG_SUGGESTION_PROPS = {}> = (
  props: GetTagSuggestionsProps<ADDITIONAL_TAG_SUGGESTION_PROPS>
) => Observable<Result<TagSuggestions>> | Nullish;

export type GetTagCatalog<ADDITIONAL_PROPS = {}> = (
  props: GetTagCatalogProps<ADDITIONAL_PROPS>
) => Observable<Result<TagCatalog>>;

export type QueryBuilderTrackingFunctions = {
  onTagAdded?: (newFormModel: FormModelElement, updatedFormModel: FormModelElement[]) => void;
  onTagRemoved?: (elementToRemove: FormModelElement, formModel: FormModelElement[]) => void;
  onQueryChanged?: (formModel: FormModelElement[]) => void;
  onQueryCleared?: () => void;
};

type GetSuggestionLabel = (props: { item: string; tagName: string }) => string;

interface QueryBuilderProps<
  ADDITIONAL_TAG_SUGGESTION_PROPS extends {} = {},
  ADDITIONAL_TAG_CATALOG_PROPS extends {} = {}
> {
  value: FormModelElement[];
  onChange?: (formModel: FormModelElement[]) => void;
  onError?: (props: { hasError: boolean; errors: string[] }) => void;

  tagCatalog?: TagCatalog;
  getSuggestions?: GetSuggestions<ADDITIONAL_TAG_SUGGESTION_PROPS>;
  getSuggestionLabel?: GetSuggestionLabel;
  getSuggestionsProps?: GetSuggestionsProps;
  getTagCatalog?: GetTagCatalog<ADDITIONAL_TAG_CATALOG_PROPS>;
  additionalGetTagCatalogProps?: ADDITIONAL_TAG_CATALOG_PROPS;
  addTagDefinitionToFormModel?: boolean;
  disableEntitySelection?: boolean;
  fixOverlayLeftAlignment?: boolean;
  tracking?: QueryBuilderTrackingFunctions;

  maxExpressionDepth?: number;
  useLastValidStateWhenErroneous?: boolean;
  autoFocusInput?: boolean;
  withoutOrConjunction?: boolean;
  withoutBrackets?: boolean;
  readOnly?: boolean;
  allowEmptyKey?: boolean;
}

interface CreateDynamicQueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS = {}, ADDITIONAL_TAG_CATALOG_PROPS = {}> {
  getSuggestions?: GetSuggestions<ADDITIONAL_TAG_SUGGESTION_PROPS>;
  withoutOrConjunction?: boolean;
  withoutBrackets?: boolean;
  allowEmptyKey?: boolean;
  disableEntitySelection?: boolean;
  addTagDefinitionToFormModel?: boolean;
  maxExpressionDepth?: number;
  getTagCatalog?: GetTagCatalog<ADDITIONAL_TAG_CATALOG_PROPS>;
}

interface CreateQueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS = {}, ADDITIONAL_TAG_CATALOG_PROPS = {}>
  extends CreateDynamicQueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS> {
  getTagCatalog: GetTagCatalog<ADDITIONAL_TAG_CATALOG_PROPS>;
}

export type QueryBuilderComponent<
  ADDITIONAL_TAG_SUGGESTION_PROPS = {},
  ADDITIONAL_TAG_CATALOG_PROPS = {}
> = ComponentType<QueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS, ADDITIONAL_TAG_CATALOG_PROPS>>;

interface CreateQueryBuilderResponse<ADDITIONAL_TAG_SUGGESTION_PROPS = {}> {
  getTagCatalog: GetTagCatalog;
  QueryBuilder: QueryBuilderComponent<ADDITIONAL_TAG_SUGGESTION_PROPS>;
  isQueryValid: (formModel, timeConfig) => Observable<Result<boolean>>;
  toFormModel: (tagFilterArray, timeConfig) => Observable<Result<FormModelElement[]>>;
}

interface CreateDynamicQueryBuilderResponse<ADDITIONAL_TAG_SUGGESTION_PROPS = {}> {
  QueryBuilder: QueryBuilderComponent<ADDITIONAL_TAG_SUGGESTION_PROPS>;
  isQueryValid: (formModel, tagCatalogResult: Result<TagCatalog>) => Result<boolean>;
  toFormModel: (tagFilterArray, tagCatalogResult: Result<TagCatalog>) => Result<FormModelElement[]>;
}

export function createQueryBuilder<ADDITIONAL_TAG_SUGGESTION_PROPS = {}>(
  props: CreateQueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS>
): CreateQueryBuilderResponse;

export function createDynamicQueryBuilder<ADDITIONAL_TAG_SUGGESTION_PROPS = {}, ADDITIONAL_TAG_CATALOG_PROPS = {}>(
  props: CreateDynamicQueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS, ADDITIONAL_TAG_CATALOG_PROPS>
): CreateDynamicQueryBuilderResponse;
