/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ComponentType } from 'react';

import { Observable } from '@instana/observables';

import {
  Filter,
  Nullish,
  TagFilterEntity,
  TagFilterExpression,
  TagSuggestionProposeType,
  TagSuggestions,
  TimeConfig
} from 'in-types';
import { FormModelElement } from './transformation/formModel';

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

type GetTagCatalog = (props: { timeConfig: TimeConfig }) => Observable<Result<TagCatalog>>;

export type QueryBuilderTrackingFunctions = {
  onTagAdded?: (newFormModel: FormModelElement, updatedFormModel: FormModelElement[]) => void;
  onTagRemoved?: (elementToRemove: FormModelElement, formModel: FormModelElement[]) => void;
  onQueryChanged?: (formModel: FormModelElement[]) => void;
  onQueryCleared?: () => void;
};

type GetSuggestionLabel = (props: { item: string; tagName: string }) => string;

interface QueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS extends {} = {}> {
  value: FormModelElement[];
  onChange?: (formModel: FormModelElement[]) => void;
  onError?: (props: { hasError: boolean; errors: string[] }) => void;

  getTagCatalog: GetTagCatalog;
  getSuggestions: (
    props: GetTagSuggestionsProps<ADDITIONAL_TAG_SUGGESTION_PROPS>
  ) => Observable<Result<TagSuggestions>> | Nullish;
  getSuggestionLabel?: GetSuggestionLabel;
  getSuggestionsProps?: GetSuggestionsProps;

  tracking?: QueryBuilderTrackingFunctions;

  maxExpressionDepth?: number;
  useLastValidStateWhenErroneous?: boolean;
  autoFocusInput?: boolean;
  withoutOrConjunction?: boolean;
  withoutBrackets?: boolean;
  readOnly?: boolean;
  allowEmptyKey?: boolean;
}

type CreateQueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS = {}> = Pick<
  QueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS>,
  'getTagCatalog' | 'getSuggestions' | 'withoutOrConjunction' | 'withoutBrackets' | 'maxExpressionDepth'
>;

type QueryBuilderComponentProps<ADDITIONAL_TAG_SUGGESTION_PROPS = {}> = Omit<
  QueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS>,
  'getTagCatalog' | 'getSuggestions' | 'withoutOrConjunction' | 'withoutBrackets' | 'maxExpressionDepth'
>;

export type QueryBuilderComponent<ADDITIONAL_TAG_SUGGESTION_PROPS = {}> = ComponentType<
  QueryBuilderComponentProps<ADDITIONAL_TAG_SUGGESTION_PROPS>
>;

interface CreateQueryBuilderResponse<ADDITIONAL_TAG_SUGGESTION_PROPS = {}> {
  getTagCatalog: GetTagCatalog;
  QueryBuilder: QueryBuilderComponent<ADDITIONAL_TAG_SUGGESTION_PROPS>;
  isQueryValid: (formModel, timeConfig) => Observable<Result<boolean>>;
  toFormModel: (tagFilterArray, timeConfig) => Observable<Result<FormModelElement[]>>;
}

export function createQueryBuilder<ADDITIONAL_TAG_SUGGESTION_PROPS = {}>(
  props: CreateQueryBuilderProps<ADDITIONAL_TAG_SUGGESTION_PROPS>
): CreateQueryBuilderResponse;
