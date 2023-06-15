/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';

import { GetSuggestionsProps, Suggestions } from 'in-websites/queryBuilder';
import { GetTagSuggestionsProps } from 'in-components/QueryBuilder';
import { Result, TagCatalog, TagSuggestions } from 'in-types';

declare function TagBasedPayloadConfigurator<T>({
  value,
  disabled,
  tagFilterExpression,
  onChange,
  getTagCatalog,
  suggestionsAlignedLeft,
  getSuggestions,
  hideDestinationSourceTag
}: {
  value: T;
  disabled: boolean;
  tagFilterExpression: boolean;
  onChange: (value: T) => void;
  getTagCatalog: () => Observable<Result<TagCatalog>>;
  suggestionsAlignedLeft: boolean;
  getSuggestions: (
    args: GetTagSuggestionsProps | GetSuggestionsProps
  ) => Observable<Result<TagSuggestions | Suggestions>>;
  hideDestinationSourceTag?: boolean;
}): JSX.Element;

export function createTagBasedPayloadConfigurator({
  getTagCatalog,
  getSuggestions
}: {
  getTagCatalog: () => Observable<Result<TagCatalog>>;
  getSuggestions?: (
    args: GetTagSuggestionsProps | GetSuggestionsProps
  ) => Observable<Result<TagSuggestions | Suggestions>>;
}): TagBasedPayloadConfigurator;

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

export interface GetMobileAppSuggestionsProps {
  name: string;
  key?: string;
  timeConfig: TimeConfig;
  propose?: TagSuggestionProposeType;
  tagFilterExpression?: TagFilterExpressionElementUnion;
  beaconType?: MobileAppMonitoringBeaconType;
}

export function createTagBasedMobileAppPayloadConfigurator({
  getTagCatalog,
  getSuggestions
}: {
  getTagCatalog: () => Observable<Result<TagCatalog>>;
  getSuggestions?: (args: GetMobileAppSuggestionsProps) => Observable<Result<Suggestions>>;
});

interface TagNodeLike {
  type?: string;
}

export function doesTagNodeNeedSecondLevelKey(tagNode: TagNodeLike): boolean;

interface ViewModel {
  tagName: string;
  secondLevelKey: string;
}

export function toViewModel(formModel: DynamicFieldValue): ViewModel;

export function toFormModel(viewModel: ViewModel): DynamicFieldValue;
