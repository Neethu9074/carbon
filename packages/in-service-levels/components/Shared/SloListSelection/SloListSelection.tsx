/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useRef, useState } from 'react';
import { Field, Item } from 'formalistic';

import { HorizontalIndicator, Typography, SearchInput } from '@instana/components';
import { Progress } from '@instana/components/types/util/dataRetrieval';
import { PaginatedResult, SloEntityType } from '@instana/types';

import SloTableHeader from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloTableHeader';
import SloTableSelection from 'in-service-levels/components/Shared/SloTableSelection/SloTableSelection';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import usePaginatedSloList, { SloData } from 'in-service-levels/hooks/usePaginatedSloList';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import useSelectedIds from 'in-service-levels/hooks/useSelectedIds';
import Sections from 'in-components/workspace/Sections/Sections';
import { removeAmbiguous } from 'in-service-levels/utils/array';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { t } from 'in-i18n';

export const SloListPageSize = 6;

const DEFAULT_ENTITY_TYPE: SloEntityType = 'application';

interface SloListSelectionProps {
  sloIdsField: Field<string[]> | Field<string>;
  entityTypeField: Field<SloEntityType | undefined>;
  onChange: (i: Item) => void;
}

export default function SloListSelection({ sloIdsField, entityTypeField, onChange }: SloListSelectionProps) {
  const multiSelect = isMultiSelect(sloIdsField);
  const sloIdArray = multiSelect ? sloIdsField.value : [sloIdsField.value];
  const entityType = entityTypeField.value ?? DEFAULT_ENTITY_TYPE;
  const initiallySelectedIds = useRef(sloIdArray);
  const initialEntityType = useRef(entityType);
  if (initialEntityType.current !== entityType) {
    initialEntityType.current = entityType;
    initiallySelectedIds.current = [];
  }
  const initiallyAndCurrentlySelectedIds = Array.from(
    new Set([...initiallySelectedIds.current, ...sloIdArray])
  ) as string[];
  const { loadMore, query, selected, setQuery, sloList, page, totalHits, progress } = useSloList(
    initiallyAndCurrentlySelectedIds,
    entityType
  );

  const canLoadMore = totalHits / SloListPageSize > (page ?? 0 + 1);

  const isSloIdsFieldValid = isFieldValid(sloIdsField);

  const onSelectSlo = (sloData: SloData) => {
    if (!multiSelect) {
      return onChange(sloIdsField.setValue(sloData.id).setTouched(true));
    }

    const currentIds = sloIdsField.value;
    const isAlreadySelected = currentIds.includes(sloData.id);

    const updatedIds = isAlreadySelected ? currentIds.filter(id => sloData.id !== id) : [...currentIds, sloData.id];

    onChange(sloIdsField.setValue(updatedIds).setTouched(true));
  };

  const selectedIds = selected.map(({ id }) => id);
  const initiallySelectedSlos = selected.filter(({ id }) => initiallySelectedIds.current.includes(id));
  const selectedSlosWithoutInitiallySelectedSlos = selected.filter(
    ({ id }) => !initiallySelectedIds.current.includes(id)
  );
  const filteredList = sloList.filter(({ id }) => !selectedIds.includes(id));
  const sortedList = removeAmbiguous<SloData>([
    ...initiallySelectedSlos,
    ...sortedSloDataByLabel([...selectedSlosWithoutInitiallySelectedSlos, ...filteredList])
  ]);

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
          selectedIds={multiSelect ? sloIdsField.value : [sloIdsField.value]}
          canLoadMore={canLoadMore}
          disabled={false}
          hasError={!isSloIdsFieldValid}
          itemList={sortedList}
          loadMore={loadMore}
          skeletonRows={sortedList.length ? sortedList.length : 3}
          asRadioButton={!multiSelect}
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

function isMultiSelect(sloIdsField: Field<string[]> | Field<string>): sloIdsField is Field<string[]> {
  return typeof sloIdsField.value !== 'string';
}
