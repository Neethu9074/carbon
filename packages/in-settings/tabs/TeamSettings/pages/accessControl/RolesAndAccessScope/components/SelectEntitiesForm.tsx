/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { OrderDirection, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import useFetchedStateObservable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/hooks/useFetchedStateObservable';
import {
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/types';
import SelectItemForm from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/SelectItemForm';
import EntityTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

interface SelectEntitiesFormProps<I> {
  preselectedIds: Array<string>;
  observable: () => Observable<Result<I[]>>;
  onClickCancel: VoidFunction;
  onClickSave: (mobileAppIds: Array<string>) => void;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
}

export default function SelectEntitiesForm<I>({
  preselectedIds,
  observable,
  onClickCancel,
  onClickSave,
  extractId,
  extractName
}: SelectEntitiesFormProps<I>) {
  const [
    allVisibleRowsSelected,
    setAllVisibleRowsSelected,
    selectedIds,
    setSelectedIds,
    nameQuery,
    setNameQuery,
    filteredEntities,
    orderDirection,
    setOrderDirection
  ] = useSelectEntities({
    preselectedIds,
    observable,
    extractId,
    extractName
  });

  const onClickItem = (entity: I) => {
    const id = extractId(entity);
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const onSelectAll = (selected: boolean) => {
    const [filteredEntityData] = filteredEntities;
    const filteredEntityIds = filteredEntityData?.map(extractId) ?? [];
    const selectedEntities = selected ? filteredEntityIds : [];

    setAllVisibleRowsSelected(selected);
    setSelectedIds(selectedEntities);
  };

  /**
   * resets the Sorting and the query filter
   */
  const resetForm = () => {
    setOrderDirection('ASC');
    setNameQuery('');
  };

  return (
    <SelectItemForm
      onClickCancel={() => {
        onClickCancel();
        setSelectedIds([...preselectedIds]);
        resetForm();
      }}
      onClickSave={() => {
        onClickSave(selectedIds);
        resetForm();
      }}
    >
      <EntityTable
        fetchedConfigState={filteredEntities}
        onChange={({ query, orderDirection: newState }) => {
          setNameQuery(query ?? '');
          setOrderDirection(newState ?? orderDirection);
        }}
        query={nameQuery}
        orderBy="name"
        orderDirection={orderDirection}
        onClickItem={onClickItem}
        columnDefinition={getColumnDefinition({ selectedIds, onClickItem, extractId, extractName })}
        allRowsAreSelected={allVisibleRowsSelected}
        setSelectedStateForRows={onSelectAll}
        isSearchable
      />
    </SelectItemForm>
  );
}

interface UseSelectEntitiesProps<I> {
  preselectedIds: string[];
  observable: () => Observable<Result<I[]>>;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
}

type UseSelectEntitiesResponse<I> = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  string[],
  React.Dispatch<React.SetStateAction<string[]>>,
  string,
  React.Dispatch<React.SetStateAction<string>>,
  FetchedState<Array<I>>,
  OrderDirection,
  React.Dispatch<React.SetStateAction<OrderDirection>>
];

function useSelectEntities<I>({
  preselectedIds,
  observable,
  extractId,
  extractName
}: UseSelectEntitiesProps<I>): UseSelectEntitiesResponse<I> {
  const [allVisibleRowsSelected, setAllVisibleRowsSelected] = useState(false);
  const [selectedIds, setSelectedIds] = useState(preselectedIds);
  const [nameQuery, setNameQuery] = useState('');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('ASC');
  const fetchedState = useFetchedStateObservable(observable);
  const withoutPreselectedState = filterByPreselection(fetchedState, preselectedIds, extractId);
  const filteredEntities = filterByName(withoutPreselectedState, nameQuery, extractName, orderDirection);

  return [
    allVisibleRowsSelected,
    setAllVisibleRowsSelected,
    selectedIds,
    setSelectedIds,
    nameQuery,
    setNameQuery,
    filteredEntities,
    orderDirection,
    setOrderDirection
  ];
}

function filterByPreselection<I>(
  fetchedState: FetchedState<I[]>,
  preselectedIds: string[],
  extractId: ExtractIdFunction<I>
): FetchedState<I[]> {
  const [entities, status, ...rest] = fetchedState;
  if (!entities || status !== 'resolved') return fetchedState;

  const filteredEntities = entities.filter(entity => !preselectedIds.includes(extractId(entity)));
  return [filteredEntities, status, ...rest];
}

function filterByName<I>(
  fetchedState: FetchedState<I[]>,
  nameQuery: string,
  extractName: ExtractNameFunction<I>,
  orderDirection: OrderDirection
): FetchedState<I[]> {
  const [entities, status, ...rest] = fetchedState;
  if (!entities || status !== 'resolved') return fetchedState;

  const sortedEntities = [...entities].sort((a, b) => {
    if (orderDirection === 'ASC') return compareIgnoreCase(extractName(a), extractName(b));
    return compareIgnoreCase(extractName(b), extractName(a));
  });
  if (!nameQuery) return [sortedEntities, status, ...rest];

  const lowerCaseQuery = nameQuery.toLowerCase();

  const filteredEntities = sortedEntities.filter(entity => {
    const name = extractName(entity);
    return name.toLowerCase().includes(lowerCaseQuery);
  });

  return [filteredEntities, status, ...rest];
}

interface GetColumnDefinition<I> {
  selectedIds: string[];
  onClickItem: (item: I) => void;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
}

type SelectEntitiesColumnDefinitions<I> = Array<ColumnDefinition<I>>;

function getColumnDefinition<I>({
  selectedIds,
  onClickItem,
  extractId,
  extractName
}: GetColumnDefinition<I>): SelectEntitiesColumnDefinitions<I> {
  return [
    {
      id: 'checkbox',
      label: '',
      width: 1,
      selectAllCheckbox: true,
      getContent(item) {
        const id = extractId(item);
        const isSelected = selectedIds.includes(id);
        return <CheckboxFancy size="large" checked={isSelected} onChange={() => onClickItem(item)} />;
      }
    },
    {
      id: 'name',
      sortable: true,
      label: t('in-settings:selectEntityDialog.nameColumnHead'),
      getContent(entity) {
        const name = extractName(entity);
        return <>{name}</>;
      }
    }
  ];
}
