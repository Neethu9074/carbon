/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React, { useState } from 'react';

import { ContentSwitcher, Switch } from '@instana/carbon';
import { AccessRestriction } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { t } from '@instana/i18n-react';

import {
  SCOPE_TABLE_BATCH_ACTIONS,
  SCOPE_TABLE_HEADERS,
  SCOPE_TABLE_ORDER,
  SCOPE_TABLE_PAGE_SIZES,
  SCOPE_TYPE
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection.constants';
import {
  ScopeItemRow,
  ScopeSectionProps,
  ToggleAccessPermissions
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection.types';
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
import config from 'in-services/config';

import locals from './ScopeSection.mless';

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

const toggleAccessPermissions = ({
  current,
  limited,
  toAddOnEnabled = [],
  toRemoveOnDisabled = []
}: ToggleAccessPermissions): Array<AccessRestriction> => {
  const toBeAdded = limited ? toAddOnEnabled : [];
  const toBeRemoved = limited ? [] : toRemoveOnDisabled;

  let updatedPermissions = [...current];

  if (toBeRemoved?.length > 0) {
    updatedPermissions = updatedPermissions.filter(permission => !toBeRemoved.includes(permission));
  }
  if (toBeAdded?.length > 0) {
    updatedPermissions = Array.from(new Set([...current, ...toBeAdded]));
  }

  return updatedPermissions;
};

const ACCESS_PERMISSIONS_FROM_FIELD = 'accessPermissions';

const ScopeSection = <I,>({
  extractId,
  extractName,
  fieldName,
  limitedAccessSwitchLabel,
  observable,
  limitedAccessScopes,
  tableAddLabel,
  tableTitle
}: ScopeSectionProps<I>) => {
  const { form, updateIn } = useMapFormContext<ScopeTableFormFields>(SCOPE_FORM_ID);
  const itemsField = form.getIn([fieldName]);
  const permissionsField = form.getIn([ACCESS_PERMISSIONS_FROM_FIELD]);
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

  const [scopeType, setScopeType] = useState<string>(
    permissionsField?.value && limitedAccessScopes.every(scope => permissionsField?.value?.includes(scope))
      ? SCOPE_TYPE.LIMITED_ACCESS
      : SCOPE_TYPE.ENTIRE_UNIT
  );

  const deleteEntityIdsFromScope = (ids: string[]) => {
    if (itemsField.value) {
      const updatedSelectedIds = itemsField.value.filter(selectedId => !ids.includes(selectedId));
      updateIn([fieldName], itemsField.setValue(updatedSelectedIds).setTouched(true));
      return just(success({ ids }));
    }

    return undefined;
  };

  const SCOPE_TABLE_ACTIONS: TableActions<TeamScopeEntity> = deepFreeze({
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
    <div className={locals.scopeSection}>
      <ContentSwitcher
        className={locals.scopeTypeContentSwitcher}
        selectedIndex={scopeType === SCOPE_TYPE.ENTIRE_UNIT ? 0 : 1}
        onChange={({ index = 0 }) => {
          if (index === 0) {
            setScopeType(SCOPE_TYPE.ENTIRE_UNIT);
            // Reset select entities
            updateIn([fieldName], itemsField.setValue(undefined).setTouched(true));
          } else {
            setScopeType(SCOPE_TYPE.LIMITED_ACCESS);
          }

          const updatedAccessPermissions = toggleAccessPermissions({
            current: permissionsField.value ?? [],
            limited: index !== 0,
            toAddOnEnabled: limitedAccessScopes,
            toRemoveOnDisabled: limitedAccessScopes
          });
          updateIn(
            [ACCESS_PERMISSIONS_FROM_FIELD],
            permissionsField.setValue(updatedAccessPermissions).setTouched(true)
          );
        }}
        size="sm"
      >
        <Switch
          name={SCOPE_TYPE.ENTIRE_UNIT}
          text={t('in-settings:dialogs.scope.entireUnit', {
            tenantUnit: config.tenantUnit,
            tenant: config.tenant
          })}
        />
        <Switch name={SCOPE_TYPE.LIMITED_ACCESS} text={limitedAccessSwitchLabel} />
      </ContentSwitcher>

      {scopeType === SCOPE_TYPE.LIMITED_ACCESS && (
        <MultiSelectDataTable
          getBatchActionItems={() => SCOPE_TABLE_BATCH_ACTIONS}
          getEntityName={({ name }) => t('in-settings:tabs.teams.scopeItemName', { name: name })}
          getMenuItems={row => createMenuItemsForRow(scopeEntities, row)}
          initalSortConfig={SCOPE_TABLE_ORDER}
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
          pageSizes={SCOPE_TABLE_PAGE_SIZES}
          searchAttributes={['name']}
          searchPlaceholderText={t('in-settings:components.search')}
          tableActions={SCOPE_TABLE_ACTIONS}
          tableHeaders={SCOPE_TABLE_HEADERS}
          tableRows={createTableRows(scopeEntities)}
          title={tableTitle}
        />
      )}
    </div>
  );
};

export default ScopeSection;
