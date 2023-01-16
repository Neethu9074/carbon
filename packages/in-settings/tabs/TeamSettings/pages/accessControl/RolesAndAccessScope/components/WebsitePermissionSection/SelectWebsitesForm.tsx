/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { WebsiteConfiguration } from '@instana/types';

import useWebsiteConfigurations from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/WebsitePermissionSection/useWebsiteConfigurations';
import SelectItemForm from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/SelectItemForm';
import EntityTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { FetchedState } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

interface SelectWebsitesFormProps {
  preselectedWebsiteIds: Array<string>;
  onClickCancel: VoidFunction;
  onClickSave: (websiteIds: Array<string>) => void;
}

export default function SelectWebsitesForm({
  preselectedWebsiteIds,
  onClickCancel,
  onClickSave
}: SelectWebsitesFormProps) {
  const [allVisibleRowsSelected, setAllVisibleRowsSelected] = useState(false);
  const [selectedWebsiteIds, setSelectedWebsiteIds] = useState(preselectedWebsiteIds);
  const [nameQuery, setNameQuery] = useState('');
  const websiteConfigs = useWebsiteConfigurations();
  const filteredWebsiteConfigState = useSearchFilter(websiteConfigs, nameQuery);

  const onClickItem = ({ id }: WebsiteConfiguration) => {
    if (selectedWebsiteIds.includes(id)) {
      setSelectedWebsiteIds(selectedWebsiteIds.filter(websiteId => websiteId !== id));
    } else {
      setSelectedWebsiteIds([...selectedWebsiteIds, id]);
    }
  };

  const columnDefinition = useColumnDefinition({ selectedWebsiteIds, onClickItem });

  const onSelectAll = (selected: boolean) => {
    const [filteredWebsiteConfigs] = filteredWebsiteConfigState;
    const filteredWebsiteIds = filteredWebsiteConfigs?.map(({ id }) => id) ?? [];
    const selectedWebsites = selected ? filteredWebsiteIds : [];

    setAllVisibleRowsSelected(selected);
    setSelectedWebsiteIds(selectedWebsites);
  };

  return (
    <SelectItemForm
      onClickCancel={() => {
        onClickCancel();
        setSelectedWebsiteIds([...preselectedWebsiteIds]);
      }}
      onClickSave={() => {
        onClickSave(selectedWebsiteIds);
      }}
    >
      <EntityTable
        fetchedConfigState={filteredWebsiteConfigState}
        onChange={({ query }) => {
          setNameQuery(query ?? '');
        }}
        query={nameQuery}
        orderBy="name"
        orderDirection="ASC"
        onClickItem={onClickItem}
        columnDefinition={columnDefinition}
        allRowsAreSelected={allVisibleRowsSelected}
        setSelectedStateForRows={onSelectAll}
        isSearchable
      />
    </SelectItemForm>
  );
}
function useSearchFilter(
  fetchedState: FetchedState<WebsiteConfiguration[]>,
  query: string
): FetchedState<WebsiteConfiguration[]> {
  const [websiteConfigs, status, ...rest] = fetchedState;
  if (!query || !websiteConfigs || status !== 'resolved') return fetchedState;

  const lowerCaseQuery = query.toLowerCase();

  return [websiteConfigs.filter(({ name }) => name.toLowerCase().includes(lowerCaseQuery)), status, ...rest];
}

interface UseColumnDefinition {
  selectedWebsiteIds: string[];
  onClickItem: (item: WebsiteConfiguration) => void;
}

type WebsiteColumnDefinitions = Array<ColumnDefinition<WebsiteConfiguration>>;
function useColumnDefinition({ selectedWebsiteIds, onClickItem }: UseColumnDefinition): WebsiteColumnDefinitions {
  return [
    {
      id: 'checkbox',
      label: '',
      width: 1,
      selectAllCheckbox: true,
      getContent(item) {
        const isSelected = selectedWebsiteIds.includes(item.id);
        return <CheckboxFancy checked={isSelected} onChange={() => onClickItem(item)} />;
      }
    },
    {
      id: 'name',
      sortable: true,
      label: t('in-settings:selectWebsitesDialog.nameColumnHead'),
      getContent({ name }) {
        return <>{name}</>;
      }
    }
  ];
}
