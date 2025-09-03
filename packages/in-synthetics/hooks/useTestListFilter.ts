/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useState } from 'react';

import { ColumnFilter, useTestListFilterProps } from 'in-synthetics/utils/constants';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function useTestListFilter({ filterUrlPathParams, setFilter }: useTestListFilterProps) {
  const { syntheticTypes, locationIds, applicationIds, entityIds } = filterUrlPathParams;

  // Initialize local filters based on feature flag
  const [tagFilters, setTagFilters] = useState<ColumnFilter[]>([
    { id: 'type', value: syntheticTypes },
    { id: 'location', value: locationIds },
    ...(syntheticRbacLimitedEnabled
      ? [{ id: 'association', value: entityIds }]
      : [{ id: 'application', value: applicationIds }])
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
          }
    ]);
    setFilter({
      syntheticTypes: [],
      locationIds: [],
      ...(syntheticRbacLimitedEnabled ? { entityIds: [] } : { applicationIds: [] })
    });
  }, [setTagFilters, setFilter]);

  const getFilterLabel = useCallback(({ id, value }) => {
    switch (id) {
      case 'type':
        return t('in-synthetics:dashboard.testList.tagFilter.filters_type', {
          value
        });
      case 'location':
        return t('in-synthetics:dashboard.testList.tagFilter.filters_location', {
          value
        });
      case 'association':
        return t('in-synthetics:dashboard.testList.tagFilter.filters_association', {
          value
        });
      case 'application':
        return t('in-synthetics:dashboard.testList.tagFilter.filters_application', {
          value
        });
      default:
        return t('in-synthetics:dashboard.testList.tagFilter.filters');
    }
  }, []);

  return {
    getFilterLabel,
    tagFilters,
    setTagFilters,
    resetFilters
  };
}
