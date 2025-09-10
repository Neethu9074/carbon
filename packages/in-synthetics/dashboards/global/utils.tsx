/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ArrowsVertical, ArrowUp, ArrowDown } from '@carbon/icons-react';
import React from 'react';

import { Result, SyntheticTest } from '@instana/types';

import Filters from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { SortDirectionType } from 'in-synthetics/components/constants';
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

/**
 * Get the next sort direction in the cycle: NONE -> ASC -> DESC -> NONE
 */
export const getNextSortDirection = (sortDirection: SortDirectionType): SortDirectionType => {
  switch (sortDirection) {
    case 'NONE':
      return 'ASC';
    case 'ASC':
      return 'DESC';
    case 'DESC':
      return 'NONE';
    default:
      return 'ASC';
  }
};

/**
 * Get the appropriate sort icon based on the current sort direction
 */
export const getSortIcon = (sortDirection: SortDirectionType): JSX.Element => {
  switch (sortDirection) {
    case 'ASC':
      return <ArrowUp />;
    case 'DESC':
      return <ArrowDown />;
    case 'NONE':
    default:
      return <ArrowsVertical />;
  }
};

export const createEntityMap = (
  data: SyntheticTest[] | undefined,
  idField: keyof SyntheticTest,
  labelField: keyof SyntheticTest
): Record<string, string> => {
  return (
    data?.reduce((map, test) => {
      if (test[idField] && test[labelField]) {
        const ids = test[idField] as unknown as string[];
        const labels = test[labelField] as unknown as string[];

        ids.forEach((id, i) => {
          const label = labels[i];
          if (id && label && !map[id]) {
            map[id] = label;
          }
        });
      }
      return map;
    }, {} as Record<string, string>) || {}
  );
};

export function getFilterDisplayName(filter: string, map: Map<string, string>) {
  for (let [key, value] of map.entries()) {
    if (key === filter) {
      return value;
    } else {
      continue;
    }
  }
  return filter;
}
