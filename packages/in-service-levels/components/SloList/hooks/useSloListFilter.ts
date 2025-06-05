/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useEffect, useState } from 'react';
import { ColumnFilter } from '@tanstack/react-table';

import { generateStableHash } from '@instana/utils';

import { SloListFilterPartialProps } from 'in-service-levels/components/SloList/components/SloListFilters';
import { SloListFilterState } from 'in-service-levels/hooks/useSloListFilterUrlState';
import useSloGroups from 'in-service-levels/hooks/useSloGroups';
import { t } from 'in-i18n';

export interface SloListFilterPanelProps {
  filterUrlPathParams: SloListFilterState;
  setFilterUrlPathParams: (change: Partial<SloListFilterState>) => void;
  query: string;
}
export default function useSloListFilter({
  filterUrlPathParams,
  setFilterUrlPathParams,
  query
}: SloListFilterPanelProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { tags, entityType, sloStatus, blueprint } = filterUrlPathParams;

  const [groups] = useSloGroups({ blueprint, entityType, sloStatus, tags, query });

  const [localFilters, setLocalFilters] = useState<ColumnFilter[]>([
    {
      id: 'tags' as const,
      value: tags
    },
    {
      id: 'entityType' as const,
      value: entityType
    },
    {
      id: 'sloStatus' as const,
      value: sloStatus
    },
    {
      id: 'blueprint' as const,
      value: blueprint
    }
  ]);

  // Effect to keep filter panel state in sync when local filters are cleared
  useEffect(() => {
    if (popoverOpen) {
      setLocalFilterChange(filterUrlPathParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popoverOpen, generateStableHash(filterUrlPathParams)]);

  const resetFilters = useCallback(() => {
    setLocalFilters([]);
    setFilterUrlPathParams({ entityType: undefined, sloStatus: undefined, tags: [], blueprint: undefined });
  }, [setFilterUrlPathParams]);

  const setFilterFromColumnFilters = useCallback(
    (columnFilter: ColumnFilter[]) => setFilterUrlPathParams(mapColumnFiltersToUrlState(columnFilter)),
    [setFilterUrlPathParams]
  );

  const setLocalFilterChange = (filters: SloListFilterPartialProps) => {
    setLocalFilters(prev => [
      ...prev.filter(filterItem => !(filterItem.id in filters)),
      ...Object.entries(filters)
        .filter(([_, value]) => value !== undefined)
        .map(([id, value]) => ({ id, value }))
    ]);
  };

  const getFilterLabel = useCallback(
    ({ id, value }) =>
      `${t('in-service-levels:sloList.components.sloTagFilter.filters', {
        context: id,
        value
      })}`,
    []
  );

  return {
    filterPanelProps: {
      popoverOpen,
      setPopoverOpen,
      getFilterLabel,
      setFilterFromColumnFilters,
      localFilters,
      setLocalFilters,
      setLocalFilterChange,
      resetFilters
    },
    groups
  };
}

export function mapColumnFiltersToUrlState(columnFilters: ColumnFilter[]): SloListFilterState {
  const result = columnFilters.reduce(
    (filters, { id, value }) => ({
      ...filters,
      [id]: value
    }),
    { tags: [], entityType: undefined, sloStatus: undefined, blueprint: undefined }
  );
  return result;
}
