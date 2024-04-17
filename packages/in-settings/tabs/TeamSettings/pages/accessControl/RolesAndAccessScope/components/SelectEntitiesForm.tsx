/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from 'react';

import { OrderDirection, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import {
  ExtractContributionFilterNameFunction,
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/types';
import useFetchedStateObservable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/hooks/useFetchedStateObservable';
import SelectItemForm from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/SelectItemForm';
import EntityTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

interface SelectEntitiesFormProps<I extends Object> {
  preselectedIds: Array<string>;
  observable: () => Observable<Result<I[]>>;
  onClickCancel: VoidFunction;
  onClickSave: (mobileAppIds: Array<string>) => void;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
  extractContributionFilterName?: ExtractContributionFilterNameFunction<I>;
}

export default function SelectEntitiesForm<I extends Object>({
  preselectedIds,
  observable,
  onClickCancel,
  onClickSave,
  extractId,
  extractName,
  extractContributionFilterName
}: SelectEntitiesFormProps<I>) {
  const [
    allVisibleRowsSelected,
    setAllVisibleRowsSelected,
    selectedIds,
    setSelectedIds,
    searchQuery,
    setSearchQuery,
    filteredEntities,
    orderDirection,
    setOrderDirection,
    orderBy,
    setOrderBy
  ] = useSelectEntities({
    preselectedIds,
    observable,
    extractId,
    extractName,
    extractContributionFilterName
  });

  const onClickItem = (entity: I) => {
    const id = extractId(entity);
    if (selectedIds.includes(id)) {
      // Unselect selected id
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));

      // Uncheck all rows selected if needed
      if (allVisibleRowsSelected) {
        setAllVisibleRowsSelected(false);
      }
    } else {
      // Add selected id
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
    setSearchQuery('');
    setOrderBy('name');
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
        onChange={({ query, orderDirection: newState, orderBy }) => {
          setSearchQuery(query ?? '');
          setOrderDirection(newState ?? orderDirection);
          setOrderBy(orderBy ?? 'name');
        }}
        query={searchQuery}
        orderBy={orderBy}
        orderDirection={orderDirection}
        onClickItem={onClickItem}
        columnDefinition={getColumnDefinition({
          selectedIds,
          onClickItem,
          extractId,
          extractName,
          extractContributionFilterName
        })}
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
  extractContributionFilterName?: ExtractContributionFilterNameFunction<I>;
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
  React.Dispatch<React.SetStateAction<OrderDirection>>,
  string,
  React.Dispatch<React.SetStateAction<string>>
];

function useSelectEntities<I>({
  preselectedIds,
  observable,
  extractId,
  extractName,
  extractContributionFilterName
}: UseSelectEntitiesProps<I>): UseSelectEntitiesResponse<I> {
  const [allVisibleRowsSelected, setAllVisibleRowsSelected] = useState(false);
  const [selectedIds, setSelectedIds] = useState(preselectedIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('ASC');
  const [orderBy, setOrderBy] = useState('name');
  const fetchedState = useFetchedStateObservable(observable);
  const extractField =
    (orderBy === 'restrictingApplicationName' ? extractContributionFilterName : extractName) ?? extractName;
  const withoutPreselectedState = filterByPreselection(fetchedState, preselectedIds, extractId);
  const filteredEntities = filterByName(
    withoutPreselectedState,
    searchQuery,
    orderDirection,
    extractField,
    extractName,
    extractContributionFilterName
  );

  useEffect(() => {
    // Ensure selectedIds is updated when preselectedIds changes,
    // to avoid that already unselected ids are still shown as selected.
    setSelectedIds(preselectedIds);
  }, [preselectedIds]);

  return [
    allVisibleRowsSelected,
    setAllVisibleRowsSelected,
    selectedIds,
    setSelectedIds,
    searchQuery,
    setSearchQuery,
    filteredEntities,
    orderDirection,
    setOrderDirection,
    orderBy,
    setOrderBy
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
  searchQuery: string,
  orderDirection: OrderDirection,
  extractField: (entity: I) => string,
  extractName: ExtractNameFunction<I>,
  extractContributionFilterName?: ExtractContributionFilterNameFunction<I>
): FetchedState<I[]> {
  const [entities, status, ...rest] = fetchedState;
  if (!entities || status !== 'resolved') return fetchedState;

  const sortedEntities = [...entities].sort((a, b) => {
    if (orderDirection === 'ASC') return compareIgnoreCase(extractField(a), extractField(b));
    return compareIgnoreCase(extractField(b), extractField(a));
  });
  if (!searchQuery?.trim()) return [sortedEntities, status, ...rest];

  const lowerCaseQuery = searchQuery?.trim().toLowerCase();
  const filteredEntities = sortedEntities.filter(entity => {
    const name = extractName(entity);
    const contributionFilterName = extractContributionFilterName && extractContributionFilterName(entity);
    return (
      name.toLowerCase().includes(lowerCaseQuery) || contributionFilterName?.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return [filteredEntities, status, ...rest];
}

interface GetColumnDefinition<I> {
  selectedIds: string[];
  onClickItem: (item: I) => void;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
  extractContributionFilterName?: ExtractContributionFilterNameFunction<I>;
}

type SelectEntitiesColumnDefinitions<I extends Object> = Array<ColumnDefinition<I>>;

function getColumnDefinition<I extends Object>({
  selectedIds,
  onClickItem,
  extractId,
  extractName,
  extractContributionFilterName
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
    },
    ...(extractContributionFilterName && applicationContributionFilterEnabled
      ? [
          {
            id: 'restrictingApplicationName',
            sortable: true,
            label: t('in-settings:selectEntityDialog.contributionFilterColumnHead'),
            getContent(entity: I) {
              const contributionFilterName = extractContributionFilterName(entity);
              return <>{contributionFilterName}</>;
            }
          }
        ]
      : [])
  ];
}
