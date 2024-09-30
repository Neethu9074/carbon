/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState, useEffect } from 'react';

import {
  PaginatedResult,
  SloEntityType,
  Progress,
  SloEntityUnion,
  ServiceLevelObjectiveConfiguration
} from '@instana/types';
import { generateStableHash } from '@instana/utils';

import { SloListPageSize } from 'in-service-levels/components/Shared/SloListSelection/SloListSelection';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';

export interface SloData {
  id: string;
  label: string;
  entityName: string;
  entityType: SloEntityUnion['type'];
  query?: string;
  page?: number;
}

export interface UseBufferedSloDataProps extends Pick<PaginatedResult<any>, 'page'> {
  query: string;
  entityType: SloEntityType;
}

export interface UseBufferedSloDataResult extends Pick<PaginatedResult<any>, 'page' | 'pageSize' | 'totalHits'> {
  sloList: SloData[];
  clear: VoidFunction;
  progress: Progress;
}

export default function usePaginatedSloList({
  page,
  query,
  entityType
}: UseBufferedSloDataProps): UseBufferedSloDataResult {
  const [sloList, setSloList] = useState<SloData[]>([]);
  const [data, , , progress] = useSloConfigurations({
    page,
    pageSize: SloListPageSize,
    query,
    entityType,
    orderBy: 'name'
  });

  useEffect(() => {
    const sloData = sloConfigsToSloData(data?.items ?? [], page, query);

    // In order to fix some race conditions we had, we nee to do the entire filtering on UI side.
    const filteredSloList = filterByPayloadData([...sloList, ...sloData], entityType, page, query);

    setSloList(filteredSloList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash({ data }), entityType, query]);

  return {
    sloList,
    clear: () => setSloList([]),
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 0,
    totalHits: data?.totalHits ?? 0,
    progress
  };
}

function filterByPayloadData(
  sloData: SloData[],
  entityType: SloEntityUnion['type'],
  page: number,
  query: string
): SloData[] {
  return sloData.filter(({ label, entityType: itemEntityType, page: itemPage }) => {
    const matchPage = (itemPage ?? 0) <= page;
    const matchEntityType = itemEntityType === entityType;
    const matchQuery = label.match(new RegExp(query, 'gi'));
    return matchPage && matchEntityType && matchQuery;
  });
}

export function sloConfigsToSloData(
  sloConfigs: ServiceLevelObjectiveConfiguration[],
  page?: number,
  query?: string
): SloData[] {
  return sloConfigs.map(({ id, name, entity }) => ({
    id: id as string,
    label: name,
    entityName: '',
    entityType: entity.type,
    page,
    query
  }));
}
