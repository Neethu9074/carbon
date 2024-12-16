/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, TagFilterExpressionElementUnion, ThresholdType, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import { GetMobileAppSuggestionsProps } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
//@ts-expect-error Needs TS migration
import { getSuggestions } from 'in-mobile-apps/queryBuilder';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { CreateQueryBuilderResponse } from 'in-components/QueryBuilder';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { Nullish, MobileAppMonitoringBeaconType } from 'in-types';
import { createQueryBuilder } from 'in-components/QueryBuilder';
import { getTagCatalog } from 'in-mobile-apps/api/tagCatalog';

/**
 * Creates a QueryBuilder that is bound to a single mobileApp, use-case and beacon-type.
 * Consequently, the suggestions shown are only part of that limited scope.
 *
 * This extends the beacon-type specific QueryBuilders by an additional
 * tagFilterExpression for the suggestions, see #withMobileAppIdFilter
 *
 * @param mobileAppId            The mobileApp ID this alert is bound to.
 * @param MobileAppMonitoringBeaconType   One of the different beacon-types, see #queryBuildersByBeaconType
 * @param suggestionTimeConfig optional, the timeframe used for resolving tag-suggestions.
 *
 * @returns A QueryBuilder where the scope is bound to a single mobileApp and beacon type.
 */

export interface Suggestions {
  suggestions: string[];
  totalHits: number;
}

export function createBoundedAlertQueryBuilder(
  mobileAppId: string | undefined,
  beaconType: MobileAppMonitoringBeaconType = 'sessionStart',
  thresholdType?: ThresholdType,
  suggestionTimeConfig?: TimeConfig
): CreateQueryBuilderResponse {
  return createQueryBuilder({
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: getUseCase(thresholdType) }),
    getSuggestions: (args: any) => {
      return getMobileAppTagSuggestions(args, mobileAppId, beaconType, suggestionTimeConfig);
    }
  });
}

function getUseCase(thresholdType?: ThresholdType) {
  if (thresholdType === ADAPTIVE_BASELINE) {
    return 'SMART_ALERTS_ADAPTIVE_BASELINE';
  } else {
    return 'SMART_ALERTS';
  }
}

export function getMobileAppTagSuggestions(
  args: GetMobileAppSuggestionsProps,
  mobileAppId: string | Nullish,
  beaconType: MobileAppMonitoringBeaconType,
  suggestionTimeConfig?: TimeConfig
): Observable<Result<Suggestions>> {
  return getSuggestions({
    ...tagSuggestionArgs(withMobileAppIdFilter(args, mobileAppId), suggestionTimeConfig),
    beaconType
  });
}

function tagSuggestionArgs(args: GetMobileAppSuggestionsProps, suggestionTimeConfig?: TimeConfig) {
  return {
    ...args,
    tagName: args.name,
    timeConfig: suggestionTimeConfig ?? args.timeConfig,
    secondLevelKeyTagName: args.key
  };
}

function create(beaconType: MobileAppMonitoringBeaconType, thresholdType?: ThresholdType) {
  return createBoundedAlertQueryBuilder(undefined, beaconType, thresholdType);
}

const queryBuildersByBeaconTypeStatic = {
  sessionStart: create('sessionStart'),
  httpRequest: create('httpRequest'),
  crash: create('crash'),
  custom: create('custom'),
  viewChange: create('viewChange')
};

const queryBuildersByBeaconTypeAdaptive = {
  sessionStart: create('sessionStart', ADAPTIVE_BASELINE),
  httpRequest: create('httpRequest', ADAPTIVE_BASELINE),
  crash: create('crash', ADAPTIVE_BASELINE),
  custom: create('custom', ADAPTIVE_BASELINE),
  viewChange: create('viewChange', ADAPTIVE_BASELINE)
};

/** helper, to create a query-builder dependent query validator */

type isQueryValidType = (tagFilterFormModel: FormModelElement[], timeConfig: TimeConfig) => Observable<Result<boolean>>;
type TagFilterTimeConfigTuple = [FormModelElement[], TimeConfig];
export const createIsAlertQueryValid = (isQueryValid: isQueryValidType) => {
  return ([tagFilterFormModel, timeConfig]: TagFilterTimeConfigTuple) => {
    return isQueryValid(tagFilterFormModel, timeConfig);
  };
};

export function getQueryBuilderForBeaconType(
  beaconType: MobileAppMonitoringBeaconType | Nullish,
  thresholdType?: ThresholdType
): CreateQueryBuilderResponse {
  if (thresholdType === ADAPTIVE_BASELINE) {
    return queryBuildersByBeaconTypeAdaptive[beaconType ?? 'sessionStart'];
  }
  return queryBuildersByBeaconTypeStatic[beaconType ?? 'sessionStart'];
}

function withMobileAppIdFilter(args: GetMobileAppSuggestionsProps, mobileAppId: string | Nullish) {
  const { tagFilterExpression } = args;
  if (mobileAppId)
    return {
      ...args,
      tagFilterExpression: addTagFilters(tagFilterExpression as TagFilterExpressionElementUnion | Nullish, [
        tagFilter('mobileBeacon.mobileApp.id', EQUALS, mobileAppId)
      ])
    };

  return args;
}
