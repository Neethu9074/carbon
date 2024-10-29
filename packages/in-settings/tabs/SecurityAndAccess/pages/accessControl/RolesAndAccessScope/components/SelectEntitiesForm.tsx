/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from 'react';

import { ButtonGroup, Stack } from '@instana/components';
import { OrderDirection, Result } from '@instana/types';
import { Observable } from '@instana/observables';
import { Checkbox } from '@instana/components';

import {
  ExtractContributionFilterNameFunction,
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/types';
import {
  Access,
  hasAccess
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/SyntheticAccessPanels/utils';
import {
  allAccessFilter,
  inheritedAccessFilter,
  inheritedCredentialsFilter,
  selectableCredentialsFilter
} from 'in-synthetics/utils/constants';
import useFetchedStateObservable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/hooks/useFetchedStateObservable';
import {
  LimitableProductArea,
  ProductArea
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import SelectItemForm from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/SelectItemForm';
import EntityTable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/PermissionSelection.mless';

interface SelectEntitiesFormProps<I extends Object> {
  preselectedIds: Array<string>;
  observable: () => Observable<Result<I[]>>;
  onClickCancel: VoidFunction;
  onClickSave: (mobileAppIds: Array<string>) => void;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
  extractContributionFilterName?: ExtractContributionFilterNameFunction<I>;
  productArea?: LimitableProductArea;
  selectedApplicationIds?: Array<string> | undefined;
  applicationsAccessScope?: string;
  selectedWebsiteIds?: Array<string> | undefined;
  websitesAccessScope?: string;
  selectedMobileAppIds?: Array<string> | undefined;
  mobileAppsAccessScope?: string;
  context?: string;
}

export default function SelectEntitiesForm<I extends Object>({
  preselectedIds,
  observable,
  onClickCancel,
  onClickSave,
  extractId,
  extractName,
  extractContributionFilterName,
  productArea,
  selectedApplicationIds,
  applicationsAccessScope = '',
  selectedWebsiteIds,
  websitesAccessScope = '',
  selectedMobileAppIds,
  mobileAppsAccessScope = '',
  context
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
    setOrderBy,
    syntheticFilter,
    setSynteticFilter
  ] = useSelectEntities({
    preselectedIds,
    observable,
    extractId,
    extractName,
    extractContributionFilterName,
    productArea,
    selectedApplicationIds,
    applicationsAccessScope,
    selectedWebsiteIds,
    websitesAccessScope,
    selectedMobileAppIds,
    mobileAppsAccessScope,
    context
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
    // Also reset select all checkbox
    setAllVisibleRowsSelected(false);
  };

  const getRightHeader = (productArea: LimitableProductArea | undefined, context?: string) => {
    if (!productArea) return null;

    if (syntheticRbacLimitedEnabled && productArea === ProductArea.SYNTHETICS) {
      const testAPFilters =
        context === 'syntheticTests'
          ? [
              t('in-settings:selectEntityDialog.syntheticAllTestsAccess'),
              t('in-settings:selectEntityDialog.syntheticInheritedAccess')
            ]
          : [
              t('in-settings:selectEntityDialog.syntheticSelectableCredentialsAccess'),
              t('in-settings:selectEntityDialog.syntheticInheritedCredentialsAccess')
            ];
      return (
        <div className={locals.entitiesForm}>
          <ButtonGroup
            buttonPropsList={testAPFilters.map((type, index) => ({
              text: testAPFilters[index],
              key: type,
              onClick: () => {
                setSynteticFilter(type);
              }
            }))}
            activeKey={syntheticFilter}
          />
        </div>
      );
    }

    return null;
  };

  const getLeftHeader = (context?: string) => {
    if (
      syntheticRbacLimitedEnabled &&
      productArea === ProductArea.SYNTHETICS &&
      (syntheticFilter === inheritedAccessFilter || syntheticFilter === inheritedCredentialsFilter)
    ) {
      return (
        <Stack direction="horizontal" distribution="spaceBetween" align="center">
          {context === 'syntheticTests'
            ? syntheticRbacLimitedEnabled
              ? t('in-settings:selectEntityDialog.syntheticTableSubHeaderWebMobile')
              : t('in-settings:selectEntityDialog.syntheticTableSubHeader')
            : syntheticRbacLimitedEnabled
            ? t('in-settings:selectEntityDialog.syntheticTableSubHeaderWebMobileForCredentials')
            : null}
        </Stack>
      );
    }
    return null;
  };

  const disableRowClickbyProductArea = (productArea: LimitableProductArea | undefined) => {
    if (!productArea) return false;

    if (
      syntheticRbacLimitedEnabled &&
      productArea === ProductArea.SYNTHETICS &&
      (syntheticFilter === inheritedAccessFilter || syntheticFilter === inheritedCredentialsFilter)
    ) {
      return true;
    }

    return false;
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
          extractContributionFilterName,
          productArea,
          syntheticFilter
        })}
        allRowsAreSelected={allVisibleRowsSelected}
        setSelectedStateForRows={onSelectAll}
        isSearchable
        leftHeader={getLeftHeader(context)}
        rightHeader={getRightHeader(productArea, context)}
        disableRowClick={disableRowClickbyProductArea(productArea)}
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
  productArea: LimitableProductArea | undefined;
  selectedApplicationIds?: Array<string> | undefined;
  applicationsAccessScope?: string;
  selectedWebsiteIds?: Array<string> | undefined;
  websitesAccessScope?: string;
  selectedMobileAppIds?: Array<string> | undefined;
  mobileAppsAccessScope?: string;
  context?: string;
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
  React.Dispatch<React.SetStateAction<string>>,
  string,
  React.Dispatch<React.SetStateAction<string>>
];

function useSelectEntities<I>({
  preselectedIds,
  observable,
  extractId,
  extractName,
  extractContributionFilterName,
  productArea,
  selectedApplicationIds,
  applicationsAccessScope,
  selectedWebsiteIds,
  websitesAccessScope,
  selectedMobileAppIds,
  mobileAppsAccessScope,
  context
}: UseSelectEntitiesProps<I>): UseSelectEntitiesResponse<I> {
  const [allVisibleRowsSelected, setAllVisibleRowsSelected] = useState(false);
  const [selectedIds, setSelectedIds] = useState(preselectedIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('ASC');
  const [syntheticFilter, setSynteticFilter] = useState(
    context === 'syntheticTests' ? allAccessFilter : selectableCredentialsFilter
  );
  const [orderBy, setOrderBy] = useState('name');
  const fetchedState = useFetchedStateObservable(observable);
  const extractField =
    (orderBy === 'restrictingApplicationName' ? extractContributionFilterName : extractName) ?? extractName;
  const withoutPreselectedState = filterByPreselection(fetchedState, preselectedIds, extractId);
  let filteredEntities = filterByName(
    withoutPreselectedState,
    searchQuery,
    orderDirection,
    extractField,
    extractName,
    extractContributionFilterName
  );

  // Synthetics only filter.
  if (syntheticRbacLimitedEnabled && productArea === ProductArea.SYNTHETICS) {
    filteredEntities = filterBySyntheticTests(
      preselectedIds,
      filteredEntities,
      syntheticFilter,
      selectedApplicationIds ?? [],
      applicationsAccessScope ?? '',
      selectedWebsiteIds ?? [],
      websitesAccessScope ?? '',
      selectedMobileAppIds ?? [],
      mobileAppsAccessScope ?? ''
    );
  }

  useEffect(() => {
    // Ensure selectedIds is updated when preselectedIds changes,
    // to avoid that already unselected ids are still shown as selected.
    setSelectedIds(preselectedIds);
  }, [preselectedIds]);

  useEffect(() => {
    setSynteticFilter(context === 'syntheticTests' ? allAccessFilter : selectableCredentialsFilter);
  }, [context]);

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
    setOrderBy,
    syntheticFilter,
    setSynteticFilter
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

function filterBySyntheticTests<I>(
  preselectedIds: string[],
  fetchedState: FetchedState<I[]>,
  type: string,
  limitedScopeApplicationIds: Array<string>,
  applicationsAccessScope: string,
  limitedScopeWebsiteIds: Array<string>,
  websitesAccessScope: string,
  limitedScopeMobileAppIds: Array<string>,
  mobileAppsAccessScope: string
): FetchedState<I[]> {
  const [entities, status, ...rest] = fetchedState;
  if (!entities || status !== 'resolved') return fetchedState;

  const newEntities = entities?.filter(test => {
    // @ts-expect-error property does not exist on type I
    const parsedSupplementary = JSON.parse(test.supplementary);
    if (parsedSupplementary === null) return false;

    const applicationAccess = hasAccess(
      'application',
      applicationsAccessScope,
      limitedScopeApplicationIds,
      parsedSupplementary
    );
    const websiteAccess = hasAccess('websites', websitesAccessScope, limitedScopeWebsiteIds, parsedSupplementary);
    const mobileAppAccess = hasAccess(
      'mobileApps',
      mobileAppsAccessScope,
      limitedScopeMobileAppIds,
      parsedSupplementary
    );

    // If a test is part of the pre-selected IDs, it should not be listed.
    // @ts-expect-error name property does not exist in type I.
    const syntheticAccess = preselectedIds != null && preselectedIds.length > 0 && preselectedIds.includes(test.name);

    const isEntityInherited: boolean =
      applicationAccess != Access.NO_ACCESS &&
      websiteAccess != Access.NO_ACCESS &&
      mobileAppAccess != Access.NO_ACCESS &&
      (applicationAccess == Access.ACCESS_MATCH ||
        websiteAccess == Access.ACCESS_MATCH ||
        mobileAppAccess == Access.ACCESS_MATCH) &&
      !syntheticAccess;

    if (type === inheritedAccessFilter || type === inheritedCredentialsFilter) {
      return syntheticRbacLimitedEnabled ? isEntityInherited : applicationAccess;
    } else {
      return syntheticRbacLimitedEnabled ? !isEntityInherited : !applicationAccess;
    }
  });

  return [newEntities, status, ...rest];
}

interface SelectAllCheckboxParams {
  productArea: LimitableProductArea | undefined;
  syntheticFilter?: string | undefined;
}

function selectAllCheckboxByProductArea({ productArea, syntheticFilter }: SelectAllCheckboxParams) {
  if (!productArea) return true;
  if (
    productArea === ProductArea.SYNTHETICS &&
    (syntheticFilter === inheritedAccessFilter || syntheticFilter === inheritedCredentialsFilter)
  ) {
    return false;
  }
  return true;
}

interface GetColumnDefinition<I> {
  selectedIds: string[];
  onClickItem: (item: I) => void;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
  extractContributionFilterName?: ExtractContributionFilterNameFunction<I>;
  productArea: LimitableProductArea | undefined;
  syntheticFilter?: string;
}

type SelectEntitiesColumnDefinitions<I extends Object> = Array<ColumnDefinition<I>>;

function getColumnDefinition<I extends Object>({
  selectedIds,
  onClickItem,
  extractId,
  extractName,
  extractContributionFilterName,
  productArea,
  syntheticFilter
}: GetColumnDefinition<I>): SelectEntitiesColumnDefinitions<I> {
  return [
    {
      id: 'checkbox',
      label: '',
      width: 1,
      selectAllCheckbox: selectAllCheckboxByProductArea({ productArea, syntheticFilter }),
      sortable: false,
      getContent(item) {
        const id = extractId(item);
        const isSelected = selectedIds.includes(id);

        if (
          syntheticRbacLimitedEnabled &&
          productArea === ProductArea.SYNTHETICS &&
          (syntheticFilter === inheritedAccessFilter || syntheticFilter === inheritedCredentialsFilter)
        ) {
          return <Checkbox size="large" checked disabled />;
        }

        return <Checkbox size="large" checked={isSelected} onChange={() => onClickItem(item)} />;
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
    ...(extractContributionFilterName
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
