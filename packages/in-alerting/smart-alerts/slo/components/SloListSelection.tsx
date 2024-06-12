/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useRef, useState } from 'react';

import {
  PaginatedResult,
  Result,
  ServiceLevelObjectiveConfiguration,
  SloEntityType,
  SloEntityUnion
} from '@instana/types';
import { Progress } from '@instana/components/types/util/dataRetrieval';
import { HorizontalIndicator, Typography } from '@instana/components';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import SloTableHeader from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloTableHeader';
import SloTableSelection from 'in-service-levels/components/Shared/SloTableSelection/SloTableSelection';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import { getAllSloConfigurations } from 'in-service-levels/api/configuration';
import Sections from 'in-components/workspace/Sections/Sections';
import SearchInput from 'in-components/SearchInput/SearchInput';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
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

export default function SloListSelection() {
  const { form, onChange } = useSloAlertFormContext();
  const sloIdsField = form.getIn(['sloIds']);
  const entityTypeField = form.getIn(['entityType']);
  const { loadMore, query, selected, setQuery, sloList, page, totalHits, progress } = useSloList(
    sloIdsField.value,
    entityTypeField.value
  );

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
  const sortedList = sortedSloDataByLabel([...selected, ...filteredList]);

  return (
    <>
      <Sections>
        <SloTableHeader>
          <Typography variant="heading-200" component="h2">
            {t('in-alerting:smartAlerts.slo.advancedModeContainer.selectSloHeadline')}
          </Typography>
          <SearchInput query={query} onChange={q => setQuery(q)} />
        </SloTableHeader>
        <HorizontalIndicator progress={progress} />
        <SloTableSelection
          columns={['label']}
          onChange={onSelectSlo}
          progress={{ loading: false }}
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
    </>
  );
}

interface UseBufferedSloDataProps extends Pick<PaginatedResult<any>, 'page'> {
  query: string;
  entityType: SloEntityType | undefined;
}

interface UseBufferedSloDataResult extends Pick<PaginatedResult<any>, 'page' | 'pageSize' | 'totalHits'> {
  sloList: SloData[];
  clear: VoidFunction;
  progress: Progress;
}

function usePaginatedSloList({ page, query, entityType }: UseBufferedSloDataProps): UseBufferedSloDataResult {
  const entityTypeRef = useRef<SloEntityType>();
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
    const prevEntityType = entityTypeRef.current;
    const isInitialChange = prevEntityType === undefined;
    const hasEntityTypeChanged = prevEntityType !== entityType;
    entityTypeRef.current = entityType;

    if (progress.loading) return;
    if (hasEntityTypeChanged && !isInitialChange) return;

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

function sortedSloDataByLabel(sloData: SloData[]): SloData[] {
  return sloData.sort((a, b) => a.label.localeCompare(b.label));
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

function useSloList(selectedIds: string[], entityType: SloEntityType | undefined): UseSloListResult {
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
  const [selected] = useSelectedIds(selectedIds);
  const { sloList, clear, ...rawData } = usePaginatedSloList({ page, query: debouncedQuery, entityType });

  useEffect(() => {
    setPage(1);
  }, [entityType, debouncedQuery]);

  return {
    clear,
    loadMore: () => setPage(page + 1),
    setQuery: setQueryDebounced,
    query: queryInput,
    selected: selected ?? [],
    sloList,
    ...rawData
  };
}

function useSelectedIds(sloIds: string[]): FetchedState<SloData[]> {
  const data = useObservable(() => {
    if (sloIds.length === 0)
      return just(success({ items: [] }) as unknown as Result<PaginatedResult<ServiceLevelObjectiveConfiguration>>);
    return getAllSloConfigurations({
      ids: sloIds
    });
  }, [generateStableHash(sloIds)]);

  const [result, ...restState] = resultToFetchedStateResponse(data);

  const sloData = sloConfigsToSloData(result?.items ?? []);

  return [sloData, ...restState] as FetchedState<SloData[]>;
}
