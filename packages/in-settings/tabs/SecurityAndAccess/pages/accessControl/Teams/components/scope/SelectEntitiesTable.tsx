/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { t } from '@instana/i18n-react';

import {
  SELECT_ENTITIES_TABLE_BATCH_ACTIONS,
  SELECT_ENTITIES_TABLE_HEADERS,
  SELECT_ENTITIES_TABLE_ORDER,
  SELECT_ENTITIES_TABLE_PAGE_SIZES
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesTable.constants';
import {
  ScopeItemRow,
  SelectEntitiesTableProps
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesTable.types';
import {
  ScopeTableFormFields,
  SCOPE_FORM_ID
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import MultiSelectDataTable, {
  DataTableRow,
  Notification,
  TableActions
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import SelectEntitiesDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesDialog';
import useScopeEntityMapping from 'in-settings/tabs/SecurityAndAccess/hooks/useScopeEntityMapping';
import { useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { TeamScopeEntity } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { hasError, isLoading, success } from 'in-services/util/result';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { pendingResult } from 'in-services/fixedObjects';
import { deepFreeze } from 'in-services/util/object';
import { seconds } from 'in-services/time/time';

import locals from './SelectEntitiesTable.mless';

const createMenuItemsForRow = (
  items: TeamScopeEntity[],
  row: Omit<DataTableRow<ScopeItemRow<TeamScopeEntity>[], TeamScopeEntity>, 'rowData'>
) => {
  const item = items.filter(item => item.id === row.id)[0];
  const { name } = item;
  return [
    {
      actionType: 'delete',
      icon: <TrashCan />,
      label: t('in-settings:components.deleteEntity', { entity: name })
    }
  ];
};

const createTableRows = (items: TeamScopeEntity[] = []): Array<ScopeItemRow<TeamScopeEntity>> => {
  return items?.map((item: TeamScopeEntity) => ({
    name: item.name,
    id: item.id,
    rowData: { ...item }
  }));
};

const SelectEntitiesTable = <I,>({
  fieldName,
  extractId,
  extractName,
  observable,
  tableAddLabel,
  tableTitle,
  showTableHeader = false
}: SelectEntitiesTableProps<I>) => {
  const { form, updateIn } = useMapFormContext<ScopeTableFormFields>(SCOPE_FORM_ID);
  const itemsField = form.getIn([fieldName]);
  const dataTableResult = useObservable(observable, []) ?? pendingResult;
  const loading = isLoading(dataTableResult);
  const hasErrors = hasError(dataTableResult);

  const scopeEntities = useScopeEntityMapping<I>({
    entityIds: itemsField.value ?? [],
    extractId: extractId,
    extractName: extractName,
    observable: observable
  });

  const errorMessage: Notification | undefined = hasErrors
    ? {
        title: t('in-settings:components.errorFailedToLoadData'),
        subtitle: dataTableResult.errors[0].message,
        kind: 'error',
        timeout: seconds.toMillis(6)
      }
    : undefined;

  const deleteEntityIdsFromScope = (ids: string[]) => {
    if (itemsField.value) {
      const updatedSelectedIds = itemsField.value.filter(selectedId => !ids.includes(selectedId));
      updateIn([fieldName], itemsField.setValue(updatedSelectedIds).setTouched(true));
      return just(success({ ids }));
    }

    return undefined;
  };

  const scopeTableActions: TableActions<TeamScopeEntity> = deepFreeze({
    delete: {
      deleteEntity: ({ id }: TeamScopeEntity) => deleteEntityIdsFromScope([id]),
      batchDeleteEntity: deleteEntityIdsFromScope
    }
  } as const);

  const onSelected = (selectedIds: string[]) => {
    // Add selected entity ids to existing entity ids
    const existingIds = itemsField.value ?? [];
    const newSelectedIds = new Set([...existingIds, ...selectedIds]);

    updateIn([fieldName], itemsField.setValue(Array.from(newSelectedIds)).setTouched(true));
  };

  return (
    <div className={showTableHeader ? undefined : locals.hideSelectEntitiesTableHeader}>
      <MultiSelectDataTable
        getBatchActionItems={() => SELECT_ENTITIES_TABLE_BATCH_ACTIONS}
        getEntityName={({ name }) => t('in-settings:tabs.teams.scopeItemName', { name: name })}
        getMenuItems={row => createMenuItemsForRow(scopeEntities, row)}
        initalSortConfig={SELECT_ENTITIES_TABLE_ORDER}
        labelNew={tableAddLabel}
        loading={loading}
        message={errorMessage}
        onCreateNew={() => {
          addActiveDialog(
            <SelectEntitiesDialog<I>
              extractId={extractId}
              extractName={extractName}
              observable={observable}
              preselectedIds={itemsField.value ?? []}
              title={tableAddLabel}
              onSelected={onSelected}
            />
          );
        }}
        pageSizes={SELECT_ENTITIES_TABLE_PAGE_SIZES}
        searchAttributes={['name']}
        searchPlaceholderText={t('in-settings:components.search')}
        tableActions={scopeTableActions}
        tableHeaders={SELECT_ENTITIES_TABLE_HEADERS}
        tableRows={createTableRows(scopeEntities)}
        title={tableTitle}
      />
    </div>
  );
};

export default SelectEntitiesTable;
