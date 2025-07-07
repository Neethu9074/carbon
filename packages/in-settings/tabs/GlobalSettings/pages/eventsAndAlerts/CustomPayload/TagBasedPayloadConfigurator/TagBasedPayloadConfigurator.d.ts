/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';

import { GetSuggestionsProps as GetWebsiteSuggestionsProps, Suggestions } from 'in-websites/queryBuilder';
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
    args: GetTagSuggestionsProps | GetWebsiteSuggestionsProps
  ) => Observable<Result<TagSuggestions | Suggestions>>;
  hideDestinationSourceTag?: boolean;
}): JSX.Element;

export function createTagBasedPayloadConfigurator({
  getTagCatalog,
  getSuggestions
}: {
  getTagCatalog: () => Observable<Result<TagCatalog>>;
  getSuggestions?: (
    args: GetTagSuggestionsProps | GetWebsiteSuggestionsProps
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
  getSuggestions?: (args: GetWebsiteSuggestionsProps) => Observable<Result<Suggestions>>;
});

export function createTagBasedInfraPayloadConfigurator({
  getTagCatalog,
  getSuggestions
}: {
  getTagCatalog: () => Observable<Result<TagCatalog>>;
  getSuggestions?: (args: GetInfraSuggestionsProps) => Observable<Result<Suggestions>>;
});

export interface GetMobileAppSuggestionsProps {
  name: string;
  key?: string;
  timeConfig: TimeConfig;
  propose?: TagSuggestionProposeType;
  tagFilterExpression?: TagFilterExpressionElementUnion;
  beaconType?: MobileAppMonitoringBeaconType;
}

export interface GetInfraSuggestionsProps {
  name: string;
  key?: string;
  timeConfig: TimeConfig;
  value: any;
  propose: TagSuggestionProposeType;
  tagFilterExpression: TagFilterExpressionElementUnion;
}

export interface GetLogSuggestionsProps {
  name: string;
  key?: string;
  timeConfig: TimeConfig;
  propose: TagSuggestionProposeType;
  tagFilterExpression: TagFilterExpressionElementUnion;
}

export function createTagBasedMobileAppPayloadConfigurator({
  getTagCatalog,
  getSuggestions
}: {
  getTagCatalog: () => Observable<Result<TagCatalog>>;
  getSuggestions?: (args: GetMobileAppSuggestionsProps) => Observable<Result<Suggestions>>;
});

export function createTagBasedLogPayloadConfigurator({
  getTagCatalog,
  getSuggestions
}: {
  getTagCatalog: () => Observable<Result<CatalogResponse>>;
  getSuggestions?: (args: GetLogSuggestionsProps) => Observable<Result<Suggestions>>;
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
