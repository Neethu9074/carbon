/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Result, SyntheticTest } from '@instana/types';

import Filters from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { PresenterProps } from 'in-synthetics/utils/constants';

export const useFilterHeader = (isFilterAllowed: boolean, syntheticTests: Result<SyntheticTest[]>, setFilter: any) => {
  return function Filter({ syntheticTypes, locationIds, applicationIds, entityIds }: PresenterProps) {
    if (!isFilterAllowed) {
      return undefined;
    } else {
      const filterProps = {
        result: syntheticTests,
        setFilter: setFilter,
        syntheticTypes: syntheticTypes,
        locationIds: locationIds,
        ...(syntheticRbacLimitedEnabled ? { entityIds: entityIds } : { applicationIds: applicationIds })
      };
      return <Filters {...filterProps} />;
    }
  };
};
