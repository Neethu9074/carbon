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
  const [allRowsAreSelected, setAllRowsAreSelected] = useState(false);
  const [selectedWebsiteIds, setSelectedWebsiteIds] = useState(preselectedWebsiteIds);
  const [nameQuery, setNameQuery] = useState('');
  const websiteConfigs = useWebsiteConfigurations();
  const filteredWebsiteConfigs = useSearchFilter(websiteConfigs, nameQuery);

  const onClickItem = ({ id }: WebsiteConfiguration) => {
    if (selectedWebsiteIds.includes(id)) {
      setSelectedWebsiteIds(selectedWebsiteIds.filter(websiteId => websiteId !== id));
    } else {
      setSelectedWebsiteIds([...selectedWebsiteIds, id]);
    }
  };

  const onSelectAll = (selected: boolean) => {
    const [websites] = websiteConfigs;
    const selectedWebsites = websites && selected ? websites.map(({ id }) => id) : [];

    setAllRowsAreSelected(selected);
    setSelectedWebsiteIds(selectedWebsites);
  };

  const columnDefinition: Array<ColumnDefinition<WebsiteConfiguration>> = [
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
        fetchedConfigState={filteredWebsiteConfigs}
        onChange={({ query }) => {
          setNameQuery(query ?? '');
        }}
        query={nameQuery}
        orderBy="name"
        orderDirection="ASC"
        onClickItem={onClickItem}
        columnDefinition={columnDefinition}
        allRowsAreSelected={allRowsAreSelected}
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

  return [websiteConfigs.filter(({ name }) => name.includes(query)), status, ...rest];
}
