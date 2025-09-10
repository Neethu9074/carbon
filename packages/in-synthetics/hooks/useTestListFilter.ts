/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useState } from 'react';

import { syntheticRbacLimitedEnabled, syntheticRunNowEnabled } from 'in-services/featureFlags';
import { ColumnFilter, useTestListFilterProps } from 'in-synthetics/utils/constants';
import { t } from 'in-i18n';

export default function useTestListFilter({
  filterUrlPathParams,
  setFilter,
  locationMap = {}
}: useTestListFilterProps & { locationMap?: Record<string, string> }) {
  const { syntheticTypes, locationIds, applicationIds, entityIds, executionType } = filterUrlPathParams;

  // Initialize local filters based on feature flags
  const [tagFilters, setTagFilters] = useState<ColumnFilter[]>([
    { id: 'type', value: syntheticTypes },
    { id: 'location', value: locationIds },
    ...(syntheticRbacLimitedEnabled
      ? [{ id: 'association', value: entityIds }]
      : [{ id: 'application', value: applicationIds }]),
    ...(syntheticRunNowEnabled && executionType ? [{ id: 'executionType', value: executionType }] : [])
  ]);

  const resetFilters = useCallback(() => {
    setTagFilters([
      {
        id: 'type',
        value: []
      },
      {
        id: 'location',
        value: []
      },
      syntheticRbacLimitedEnabled
        ? {
            id: 'association',
            value: []
          }
        : {
            id: 'application',
            value: []
          },
      ...(syntheticRunNowEnabled ? [{ id: 'executionType', value: [] }] : [])
    ]);
    setFilter({
      syntheticTypes: [],
      locationIds: [],
      ...(syntheticRbacLimitedEnabled ? { entityIds: [] } : { applicationIds: [] }),
      ...(syntheticRunNowEnabled ? { executionType: [] } : {})
    });
  }, [setTagFilters, setFilter]);
  const getFilterLabel = useCallback(
    ({ id, value }) => {
      switch (id) {
        case 'type':
          return t('in-synthetics:dashboard.testList.tagFilter.filters_type', {
            value
          });
        case 'location':
          return t('in-synthetics:dashboard.testList.tagFilter.filters_location', {
            value: locationMap?.[value] ?? value
          });
        case 'association':
          return t('in-synthetics:dashboard.testList.tagFilter.filters_association', {
            value
          });
        case 'application':
          return t('in-synthetics:dashboard.testList.tagFilter.filters_application', {
            value
          });
        case 'executionType':
          return t('in-synthetics:dashboard.testList.tagFilter.filters_executionType', {
            value
          });
        default:
          return t('in-synthetics:dashboard.testList.tagFilter.filters');
      }
    },
    [locationMap]
  );

  return {
    getFilterLabel,
    tagFilters,
    setTagFilters,
    resetFilters,
    locationMap
  };
}
