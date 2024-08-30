/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState, useEffect } from 'react';

import { PaginatedResult, SloEntityType, Progress } from '@instana/types';
import { generateStableHash } from '@instana/utils';

import {
  SloData,
  SloListPageSize,
  resultToSloData
} from 'in-alerting/smart-alerts/slo/components/SloListSelection/SloListSelection';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';

export interface UseBufferedSloDataProps extends Pick<PaginatedResult<any>, 'page'> {
  query: string;
  entityType: SloEntityType | undefined;
}

export interface UseBufferedSloDataResult extends Pick<PaginatedResult<any>, 'page' | 'pageSize' | 'totalHits'> {
  sloList: SloData[];
  clear: VoidFunction;
  progress: Progress;
}

export function usePaginatedSloList({ page, query, entityType }: UseBufferedSloDataProps): UseBufferedSloDataResult {
  const [sloList, setSloList] = useState<SloData[]>([]);
  const [data, , , progress] = useSloConfigurations({
    page,
    pageSize: SloListPageSize,
    query,
    entityType,
    orderBy: 'name'
  });

  useEffect(() => {
    setSloList([]);
  }, [entityType]);

  useEffect(() => {
    if (progress.loading) return;

    const sloData = data ? resultToSloData(data) : [];
    setSloList([...sloList, ...sloData]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.loading, generateStableHash(data)]);

  return {
    sloList,
    clear: () => setSloList([]),
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 0,
    totalHits: data?.totalHits ?? 0,
    progress
  };
}
