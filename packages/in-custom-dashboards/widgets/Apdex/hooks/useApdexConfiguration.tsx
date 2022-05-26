/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { getEmptyTagFilterExpression } from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { FetchedState } from 'in-hooks/utils/types';
import { success } from 'in-services/util/result';
import { ApdexConfiguration } from 'in-types';

// TODO: This is a mock function and has to be replaced by an observable when the API is ready to use.
export default function useApdexConfiguration(
  entityType: ApdexEntityTypes,
  entityId: string
): FetchedState<Array<ApdexConfiguration> | undefined> {
  const config: ApdexConfiguration = {
    apdexEntity: {
      apdexType: entityType,
      entityId,
      tagFilterExpression: getEmptyTagFilterExpression(),
      threshold: 0.8,
      beaconType: 'httpRequest'
    },
    createdAt: Date.now(),
    id: entityId,
    apdexName: 'Foo'
  };
  return resultToFetchedStateResponse(success([config]));
}
