/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ComponentType } from 'react';

import { Observable } from '@instana/observables';

import { TagFilterEntity, TagFilterExpression, TagSuggestionProposeType, TagSuggestions, TimeConfig } from 'in-types';
import { FormModelElement } from './transformation/formModel';

export type GetSuggestionsProps = { [key: string]: unknown };

interface GetTagSuggestionsProps {
  tagFilterExpression: TagFilterExpression;
  name: string;
  tagName: string;
  entity: TagFilterEntity;
  key: string;
  timeConfig: TimeConfig;
  propose: TagSuggestionProposeType;
  getSuggestionsProps?: GetSuggestionsProps;
}

type GetTagCatalog = (tc: { timeConfig: TimeConfig }) => Observable<Result<TagCatalog>>;

type CreateQueryBuilderProps = Extract<
  QueryBuilderProps,
  'getTagCatalog' | 'getSuggestions' | 'withoutOrConjunction' | 'withoutBrackets' | 'maxExpressionDepth'
>;

export type QueryBuilderTrackingFunctions = {
  onTagAdded?: (newFormModel: FormModelElement, updatedFormModel: FormModelElement[]) => void;
  onTagRemoved?: (elementToRemove: FormModelElement, formModel: FormModelElement[]) => void;
  onQueryChanged?: (formModel: FormModelElement[]) => void;
};

type GetSuggestionLabel = (props: { item: string; tagName: string }) => string;

interface QueryBuilderProps {
  value: formModel;
  onChange: (formModel: FormModelElement[]) => void;
  onError?: (props: { hasError: boolean; errors: string[] }) => void;

  getTagCatalog: GetTagCatalog;
  getSuggestions: (props: GetTagSuggestionsProps) => Observable<Result<TagSuggestions>>;
  getSuggestionLabel?: GetSuggestionLabel;
  getSuggestionsProps?: GetSuggestionsProps;

  tracking?: QueryBuilderTrackingFunctions;

  maxExpressionDepth?: number;
  useLastValidStateWhenErroneous?: boolean;
  autoFocusInput?: boolean;
  withoutOrConjunction?: boolean;
  withoutBrackets?: boolean;
}

type QueryBuilderComponentProps = Omit<
  QueryBuilderProps,
  'getTagCatalog' | 'getSuggestions' | 'withoutOrConjunction' | 'withoutBrackets' | 'maxExpressionDepth'
>;

export type QueryBuilderComponent = ComponentType<QueryBuilderComponentProps>;

interface CreateQueryBuilderResponse {
  getTagCatalog: GetTagCatalog;
  QueryBuilder: QueryBuilderComponent;
  isQueryValid: (formModel, timeConfig) => Observable<Result<boolean>>;
  toFormModel: (tagFilterArray, timeConfig) => Observable<Result<FormModelElement[]>>;
}

export function createQueryBuilder(props: CreateQueryBuilderProps): CreateQueryBuilderResponse;
