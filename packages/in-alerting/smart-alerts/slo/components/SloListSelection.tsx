/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import {
  PaginatedResult,
  Result,
  ServiceLevelObjectiveConfiguration,
  SloEntityType,
  SloEntityUnion
} from '@instana/types';
import { Progress } from '@instana/components/types/util/dataRetrieval';
import { combineLatest } from '@instana/observables';
import { generateStableHash } from '@instana/utils';
import { Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import SloTableHeader from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloTableHeader';
import SloTableSelection from 'in-service-levels/components/Shared/SloTableSelection/SloTableSelection';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import { getSloConfiguration } from 'in-service-levels/api/configuration';
import Sections from 'in-components/workspace/Sections/Sections';
import SearchInput from 'in-components/SearchInput/SearchInput';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const SloListPageSize = 6;

export interface SloData {
  id: string;
  label: string;
  entityName: string;
  entityType: SloEntityUnion['type'];
}

interface SloListSelectionProps {
  entity: SloEntityType;
}
export default function SloListSelection({ entity }: SloListSelectionProps) {
  // eslint-disable-next-line no-console
  console.log('entity', entity);
  const { form, onChange } = useSloAlertFormContext();
  const sloIdsField = form.getIn(['sloIds']);
  const { loadMore, query, selected, setQuery, sloList, page, totalHits, progress } = useSloList(sloIdsField.value);

  const canLoadMore = totalHits / SloListPageSize > (page ?? 0 + 1);

  const isSloIdsFieldValid = isFieldValid(sloIdsField);

  const onSelectSlo = (sloData: SloData) => {
    const currentIds = sloIdsField.value;
    const isAlreadySelected = currentIds.includes(sloData.id);

    const updatedIds = isAlreadySelected ? currentIds.filter(id => sloData.id !== id) : [...currentIds, sloData.id];

    onChange(['sloIds'], () => sloIdsField.setValue(updatedIds).setTouched(true));
  };

  const selectedIds = selected.map(({ id }) => id);
  const filteredList = sloList.filter(({ id }) => !selectedIds.includes(id));
  const sortedList = [...selected, ...filteredList];

  return (
    <Sections>
      <SloTableHeader>
        <Typography variant="heading-200" component="h2">
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.selectSloHeadline')}
        </Typography>
        <SearchInput query={query} onChange={q => setQuery(q)} />
      </SloTableHeader>
      <SloTableSelection
        columns={['label']}
        onChange={onSelectSlo}
        progress={progress}
        selectedIds={sloIdsField.value}
        canLoadMore={canLoadMore}
        disabled={false}
        hasError={!isSloIdsFieldValid}
        itemList={sortedList}
        loadMore={loadMore}
        skeletonRows={sortedList.length ? sortedList.length : 3}
      />
      {!isSloIdsFieldValid &&
        sloIdsField.messages.map(({ message, path }, index) => (
          <ValidationBlock key={`${path}:${index}`}>{message}</ValidationBlock>
        ))}
    </Sections>
  );
}

interface UseBufferedSloDataProps extends Pick<PaginatedResult<any>, 'page'> {
  query: string;
}

interface UseBufferedSloDataResult extends Pick<PaginatedResult<any>, 'page' | 'pageSize' | 'totalHits'> {
  sloList: SloData[];
  clear: VoidFunction;
  progress: Progress;
}

function useBufferedSloData({ page, query }: UseBufferedSloDataProps): UseBufferedSloDataResult {
  const [sloList, setSloList] = useState<SloData[]>([]);
  const [data, , , progress] = useSloConfigurations({
    page,
    pageSize: SloListPageSize,
    query
  });

  useEffect(() => {
    if (!data) return;

    const sloData = resultToSloData(data);
    setSloList([...sloList, ...sloData]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(data)]);

  return {
    sloList,
    clear: () => setSloList([]),
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? 0,
    totalHits: data?.totalHits ?? 0,
    progress
  };
}

function sloConfigsToSloData(sloConfigs: ServiceLevelObjectiveConfiguration[]): SloData[] {
  return sloConfigs.map(({ id, name, entity }) => ({
    id: id as string,
    label: name,
    entityName: '',
    entityType: entity.type
  }));
}

function resultToSloData(result: PaginatedResult<ServiceLevelObjectiveConfiguration>): SloData[] {
  return sloConfigsToSloData(result.items);
}

interface UseSloListResult extends Pick<PaginatedResult<any>, 'page' | 'pageSize' | 'totalHits'> {
  selected: SloData[];
  sloList: SloData[];
  query: string;
  clear: VoidFunction;
  loadMore: VoidFunction;
  setQuery: (query: string) => void;
  progress: Progress;
}

function useSloList(selectedIds: string[]): UseSloListResult {
  const [query, setQuery] = useState('');
  const {
    value: queryInput,
    debouncedValue: debouncedQuery,
    onChange: setQueryDebounced
  } = useDebouncedValue(query, (q: string) => {
    setQuery(q);
    clear();
  });
  const [page, setPage] = useState(1);
  const { sloList, clear, ...rawData } = useBufferedSloData({ page, query: debouncedQuery });
  const selected = useSelectedIds(selectedIds, sloList);

  return {
    clear,
    loadMore: () => setPage(page + 1),
    setQuery: setQueryDebounced,
    query: queryInput,
    selected,
    sloList,
    ...rawData
  };
}

function useSelectedIds(selectedSloIds: string[], loadedSloData: SloData[] = []): SloData[] {
  const [sloData, , , progress] = useSloData(selectedSloIds, loadedSloData);
  const [selectedSlosBuffer, setSelectedSlosBuffer] = useState<SloData[]>([]);

  useEffect(() => {
    if (progress.loading) return;

    setSelectedSlosBuffer(sloData ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(sloData)]);

  return selectedSlosBuffer;
}

function useSloData(sloIds: string[], loadedSloData: SloData[]): FetchedState<SloData[]> {
  const cachedSloData = loadedSloData.filter(({ id }) => sloIds.includes(id));
  const filteredIds = sloIds.filter(sloId => !cachedSloData.some(({ id }) => id === sloId));
  const results = useObservable(
    () => combineLatest(filteredIds.map(id => getSloConfiguration(id))),
    [generateStableHash(filteredIds)]
  ) ?? [pendingResult];

  const result = results.reduce<Result<ServiceLevelObjectiveConfiguration[]>>((prev, current) => {
    const prevData = prev.data ?? [];
    const currentData = current.data;
    const data = currentData ? [...prevData, currentData] : prevData;

    return {
      data,
      progress: { loading: prev.progress.loading && current.progress.loading },
      errors: [...prev.errors, ...current.errors]
    };
  }, success<ServiceLevelObjectiveConfiguration[]>([]));

  const [sloConfigs, ...fetchedState] = resultToFetchedStateResponse(result);

  const sloData = sloConfigsToSloData(sloConfigs ?? []);

  return [[...cachedSloData, ...sloData], ...fetchedState] as FetchedState<SloData[]>;
}
