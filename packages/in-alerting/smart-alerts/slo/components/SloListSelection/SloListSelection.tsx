/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useRef, useState } from 'react';

import { PaginatedResult, ServiceLevelObjectiveConfiguration, SloEntityType, SloEntityUnion } from '@instana/types';
import { HorizontalIndicator, Typography, SearchInput } from '@instana/components';
import { Progress } from '@instana/components/types/util/dataRetrieval';

import SloTableHeader from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloTableHeader';
import { usePaginatedSloList } from 'in-alerting/smart-alerts/slo/components/SloListSelection/hooks/usePaginatedSloList';
import { useSelectedIds } from 'in-alerting/smart-alerts/slo/components/SloListSelection/hooks/useSelectedIds';
import SloTableSelection from 'in-service-levels/components/Shared/SloTableSelection/SloTableSelection';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import Sections from 'in-components/workspace/Sections/Sections';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { t } from 'in-i18n';

export const SloListPageSize = 6;

export interface SloData {
  id: string;
  label: string;
  entityName: string;
  entityType: SloEntityUnion['type'];
}
const DEFAULT_ENTITY_TYPE: SloEntityType = 'application';

export default function SloListSelection() {
  const { form, onChange } = useSloAlertFormContext();
  const sloIdsField = form.getIn(['sloIds']);
  const entityTypeField = form.getIn(['entityType']);
  const entityType = entityTypeField.value ?? DEFAULT_ENTITY_TYPE;
  const initiallySelectedIds = useRef(sloIdsField.value);
  const initialEntityType = useRef(entityType);
  if (initialEntityType.current !== entityType) {
    initialEntityType.current = entityType;
    initiallySelectedIds.current = [];
  }
  const initiallyAndCurrentlySelectedIds = Array.from(
    new Set([...initiallySelectedIds.current, ...sloIdsField.value])
  ) as string[];
  const { loadMore, query, selected, setQuery, sloList, page, totalHits, progress } = useSloList(
    initiallyAndCurrentlySelectedIds,
    entityType
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
  const initiallySelectedSlos = selected.filter(({ id }) => initiallySelectedIds.current.includes(id));
  const selectedSlosWithoutInitiallySelectedSlos = selected.filter(
    ({ id }) => !initiallySelectedIds.current.includes(id)
  );
  const filteredList = sloList.filter(({ id }) => !selectedIds.includes(id));
  const sortedList = [
    ...initiallySelectedSlos,
    ...sortedSloDataByLabel([...selectedSlosWithoutInitiallySelectedSlos, ...filteredList])
  ];

  return (
    <>
      <Sections>
        <SloTableHeader>
          <Typography variant="heading-200" component="h2">
            {t('in-alerting:smartAlerts.slo.advancedModeContainer.selectSloHeadline')}
          </Typography>
          <SearchInput
            query={query}
            onChange={q => setQuery(q)}
            placeholder={t('in-components:searchInput.placeholderSearch')}
          />
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

function sortedSloDataByLabel(sloData: SloData[]): SloData[] {
  return sloData.sort((a, b) => a.label.localeCompare(b.label));
}

export function sloConfigsToSloData(sloConfigs: ServiceLevelObjectiveConfiguration[]): SloData[] {
  return sloConfigs.map(({ id, name, entity }) => ({
    id: id as string,
    label: name,
    entityName: '',
    entityType: entity.type
  }));
}

export function resultToSloData(result: PaginatedResult<ServiceLevelObjectiveConfiguration>): SloData[] {
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

export function useSloList(selectedIds: string[], entityType: SloEntityType): UseSloListResult {
  const [query, setQuery] = useState('');
  const {
    value: queryInput,
    debouncedValue: debouncedQuery,
    onChange: setQueryDebounced
  } = useDebouncedValue(query, (q: string) => {
    clear();
    setQuery(q);
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
