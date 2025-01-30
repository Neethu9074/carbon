/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { Button, IconButton, Label, StackItem, Typography } from '@instana/components';
import { Result, PermissionSet, ScopeBinding, OrderDirection } from '@instana/types';
import { Observable } from '@instana/observables';
import { themes } from '@instana/design-tokens';

import EntityTableCellWithOverflow from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/EntityTableCellWithOverflow';
import useFetchedStateObservable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/hooks/useFetchedStateObservable';
import {
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/types';
import SelectEntitiesForm from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/SelectEntitiesForm';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import {
  getField,
  updateFormField
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import EntityTable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import { ScopeRoles } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './BusinessMonitoringPanel.mless';

interface BusinessMonitoringPanelProps<I extends Object, FORM_TYPE extends MapFormItems>
  extends SlideControlProps<SubSlideConfig>,
    FormControlProps<FORM_TYPE> {
  description: string;
  title: string;
  access: 'ALL' | 'NONE' | 'LIMITED';
  observable: () => Observable<Result<I[]>>;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
}

export default function BusinessMonitoringPanel<I extends Object, FORM_TYPE extends MapFormItems>({
  title,
  description,
  access,
  observable,
  extractId,
  extractName,
  setSubSlideConfig,
  setShowSubSlide,
  form,
  setForm
}: BusinessMonitoringPanelProps<I, FORM_TYPE>) {
  // get all required data for panel
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('ASC');
  const entityPermissionKey = 'businessPerspectiveIds';
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const scopeBindings = permissionSetField?.value[entityPermissionKey] ?? [];
  const businessMonitoringBindings = permissionSetField?.value[entityPermissionKey] ?? [];
  const selectedIds = getFilteredScopeIds(businessMonitoringBindings);

  // hook for holding the selected IDs in the limited access table
  const selectedPerspectives = useSelectedEntities({
    selectedIds: selectedIds,
    extractId,
    extractName,
    observable,
    orderDirection
  });

  function getFilteredScopeIds(scopeBindings: ScopeBinding[], excludeContributor: boolean = false): Array<string> {
    return scopeBindings
      .filter(({ scopeId, scopeRoleId }) => {
        if (excludeContributor) {
          // Only scopeIds with Owner or Viewer access are returned
          return scopeId !== undefined && scopeRoleId !== ScopeRoles.Contributor;
        } else {
          return scopeId !== undefined;
        }
      })
      .map<string>(({ scopeId }) => scopeId!);
  }

  const updatePermissionSet = (permissionSet: PermissionSet) => {
    const updatedForm = updateFormField(form, 'permissionSet', permissionSet, true);
    setForm(updatedForm);
  };

  // called after user selects the perspectives in the table, transfers the state from
  // table of perspectives to limited access panel
  const updateEntityIds = (entityIds?: string[]) => {
    const permissionSet = permissionSetField?.value;
    if (!permissionSet) return;

    if (!entityIds) {
      return updatePermissionSet({ ...permissionSet, [entityPermissionKey]: [] });
    }

    const keepedScopes = scopeBindings.filter(({ scopeId }) => scopeId && entityIds.includes(scopeId));

    const newScopeRoleId = ScopeRoles.Viewer;
    let newScopes;
    const scopeBindingIds = scopeBindings.map(({ scopeId }) => scopeId);
    const filteredEntityIds = entityIds.filter(id => !scopeBindingIds.includes(id));
    newScopes = filteredEntityIds.map(id => ({ scopeId: id, scopeRoleId: newScopeRoleId }));

    updatePermissionSet({
      ...permissionSet,
      [entityPermissionKey]: keepedScopes.concat(newScopes)
    });
  };

  // called when a row is deleted from the limited access perspective list
  const removeEntitiesFromPermissionSet = (entityId: string) => {
    const permissionSet = permissionSetField?.value;
    if (!permissionSet) return;

    const entityScopeBindings = scopeBindings.filter(({ scopeId }) => scopeId !== entityId);
    updatePermissionSet({ ...permissionSet, [entityPermissionKey]: entityScopeBindings });
  };

  // columns for table of selected business perspectives
  const getColumnDefinition = (): Array<ColumnDefinition<I>> => [
    {
      id: 'name',
      label: t('in-settings:selectEntityDialog.nameColumnHead'),
      getContent(entity) {
        return <EntityTableCellWithOverflow content={extractName(entity)} />;
      }
    },
    {
      id: 'action',
      label: '',
      useMinimumAmountOfHorizontalSpace: true,
      width: '4',
      sortable: false,
      getContent(entity) {
        const id = extractId(entity);
        const name = extractName(entity);
        return (
          <IconButton
            kind="primary"
            aria-label={t('in-settings:PermissionSection.deleteButton', { name })}
            onClick={() => removeEntitiesFromPermissionSet(id)}
            type="lib_openclose_remove_circle_outline"
            color={themes.default.ids.color.option.teal[500]}
          />
        );
      }
    }
  ];

  return (
    <StackItem>
      <div className={locals.title}>
        <Typography variant="heading-200" component="div">
          {title}
        </Typography>
      </div>

      {access == 'ALL' && (
        <Label className={locals.label}>{t('in-settings:permissionScope.selection_access_all')}</Label>
      )}

      {access != 'LIMITED' && (
        <Typography variant="body-regular" component="div">
          {description}
        </Typography>
      )}

      {access == 'LIMITED' && (
        <div className={locals.limitedDiv}>
          <Label className={locals.label}>{t('in-settings:permissionScope.selection_limited_access')}</Label>
          <Typography variant="body-regular" component="div">
            {description}
          </Typography>
          <StackItem>
            <Button
              kind="action"
              onClick={() => {
                setSubSlideConfig({
                  title: t('in-settings:PermissionSection.addButton_bizopsPerspectives'),
                  content: (
                    <SelectEntitiesForm
                      preselectedIds={selectedIds}
                      observable={observable}
                      extractId={extractId}
                      extractName={extractName}
                      onClickCancel={() => setShowSubSlide(false)}
                      onClickSave={ids => {
                        updateEntityIds(ids);
                        setShowSubSlide(false);
                      }}
                    />
                  )
                });
                setShowSubSlide(true);
              }}
              icon="lib_openclose_add_circle_outline"
            >
              {t('in-settings:PermissionSection.addButton_bizopsPerspectives')}
            </Button>
          </StackItem>
          <EntityTable
            fetchedConfigState={selectedPerspectives}
            query=""
            orderBy="name"
            orderDirection={orderDirection}
            onClickItem={noop}
            onChange={({ orderDirection: dir }) => setOrderDirection(dir ?? orderDirection)}
            columnDefinition={getColumnDefinition()}
            paginated
          />
        </div>
      )}
    </StackItem>
  );
}

interface UseSelectEntitiesProps<I> {
  selectedIds: string[];
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
  observable: () => Observable<Result<I[]>>;
  orderDirection: OrderDirection;
}

function useSelectedEntities<I>({
  selectedIds,
  extractId,
  extractName,
  observable,
  orderDirection
}: UseSelectEntitiesProps<I>): FetchedState<I[]> {
  const fetchedState = useFetchedStateObservable(observable);
  const [data, status, ...rest] = fetchedState;

  if (!data || status !== 'resolved') return fetchedState;

  const filteredData = data
    ?.filter(entity => {
      const id = extractId(entity);
      return selectedIds.includes(id);
    })
    .sort((a, b) => {
      if (orderDirection === 'ASC') return compareIgnoreCase(extractName(a), extractName(b));
      return compareIgnoreCase(extractName(b), extractName(a));
    });

  return [filteredData, status, ...rest];
}
