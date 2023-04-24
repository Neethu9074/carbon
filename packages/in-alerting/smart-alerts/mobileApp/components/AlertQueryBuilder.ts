/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

//@ts-expect-error Needs TS migration
import { getTagCatalog } from 'in-mobile-apps/api/tagCatalog';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { CreateQueryBuilderResponse } from 'in-components/QueryBuilder';
import { Nullish, MobileAppMonitoringBeaconType } from 'in-types';
import { createQueryBuilder } from 'in-components/QueryBuilder';

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
 * @param thresholdType        The selected threshold type, used for selecting the use-case
 *
 * @returns A QueryBuilder where the scope is bound to a single mobileApp and beacon type.
 */

export function createBoundedAlertQueryBuilder(
  _mobileAppId: string | undefined,
  beaconType: MobileAppMonitoringBeaconType = 'sessionStart'
): CreateQueryBuilderResponse {
  return createQueryBuilder({
    getTagCatalog: () => getTagCatalog({ beaconType, useCase: 'SMART_ALERTS' })
  });
}

function create(beaconType: MobileAppMonitoringBeaconType) {
  return createBoundedAlertQueryBuilder(undefined, beaconType);
}

const queryBuildersByBeaconTypeStatic = {
  sessionStart: create('sessionStart'),
  httpRequest: create('httpRequest'),
  crash: create('crash'),
  custom: create('custom'),
  viewChange: create('viewChange')
};

/** helper, to create a query-builder dependent query validator */

type isQueryValidType = (tagFilterFormModel: FormModelElement[], timeConfig: TimeConfig) => Observable<Result<Boolean>>;
type TagFilterTimeConfigTuple = [FormModelElement[], TimeConfig];
export const createIsAlertQueryValid = (isQueryValid: isQueryValidType) => {
  return ([tagFilterFormModel, timeConfig]: TagFilterTimeConfigTuple) => {
    return isQueryValid(tagFilterFormModel, timeConfig);
  };
};

export function getQueryBuilderForBeaconType(
  beaconType: MobileAppMonitoringBeaconType | Nullish
): CreateQueryBuilderResponse {
  return queryBuildersByBeaconTypeStatic[beaconType ?? 'sessionStart'];
}
