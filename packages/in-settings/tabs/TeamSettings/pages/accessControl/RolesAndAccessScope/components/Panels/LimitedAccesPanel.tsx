/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Stack, StackItem, SvgIcon, Typography } from '@instana/components';
import { PermissionSetWithRoles, ScopeBinding, Result } from '@instana/types';
import { Observable } from '@instana/observables';
import { useTheme } from '@instana/hooks';

import {
  EntityPermissionKey,
  PermissionSectionProps
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/PermissionSection';
import {
  AreaRole,
  AreaRoleType,
  AreaRoleWithCustomType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import useFetchedStateObservable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/hooks/useFetchedStateObservable';
import {
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/types';
import SelectEntitiesForm from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/SelectEntitiesForm';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import EntityTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import Divider from 'in-components/workspace/Divider/Divider';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface LimitedAccessPanelProps<I>
  extends FormControlProps,
    Pick<
      PermissionSectionProps<I>,
      'setSubSlideConfig' | 'setShowSubSlide' | 'roleTooltipText' | 'entityPermissionKey'
    > {
  role?: AreaRoleWithCustomType;
  description: string;
  addButtonLabel: string;
  entityPermissionKey: EntityPermissionKey;
  observable: () => Observable<Result<I[]>>;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
  onChangeRole: (role: AreaRoleType) => void;
}

export default function LimitedAccessPanel<I>({
  roleTooltipText,
  role,
  form,
  description,
  addButtonLabel,
  entityPermissionKey,
  observable,
  setForm,
  extractId,
  extractName,
  onChangeRole,
  setShowSubSlide,
  setSubSlideConfig
}: LimitedAccessPanelProps<I>) {
  const theme = useTheme();
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  const scopeBindings = permissionSetField?.value[entityPermissionKey] ?? [];

  const selectedIds = getFilteredScopeIds(scopeBindings);
  const selectedEntities = useSelectedEntities({ selectedIds, extractId, extractName, observable });

  const updatePermissionSet = (permissionSet: PermissionSetWithRoles) => {
    const updatedForm = updateFormField(form, 'permissionSet', permissionSet, true);
    setForm(updatedForm);
  };

  const updateEntityIds = (entityIds?: string[]) => {
    const permissionSet = permissionSetField?.value;
    if (!permissionSet) return;

    if (!entityIds) {
      return updatePermissionSet({ ...permissionSet, [entityPermissionKey]: [] });
    }

    const keepedScopes = scopeBindings.filter(({ scopeId }) => scopeId && entityIds.includes(scopeId));
    const newScopes = entityIds.map(id => ({ scopeId: id, scopeRoleId: '-1' }));

    updatePermissionSet({
      ...permissionSet,
      [entityPermissionKey]: keepedScopes.concat(newScopes)
    });
  };

  const removeEntitiesFromPermissionSet = (entityId: string) => {
    const permissionSet = permissionSetField?.value;
    if (!permissionSet) return;

    const entityScopeBindings = scopeBindings.filter(({ scopeId }) => scopeId !== entityId);
    updatePermissionSet({ ...permissionSet, [entityPermissionKey]: entityScopeBindings });
  };

  const columnDefinition: Array<ColumnDefinition<I>> = [
    {
      id: 'name',
      label: t('in-settings:selectEntityDialog.nameColumnHead'),
      getContent(entity) {
        const name = extractName(entity);
        return <>{name}</>;
      }
    },
    {
      id: 'action',
      label: '',
      useMinimumAmountOfHorizontalSpace: true,
      getContent(entity) {
        const id = extractId(entity);
        const name = extractName(entity);
        return (
          <SvgIcon
            aria-label={t('in-settings:PermissionSection.deleteButton', { name })}
            onClick={() => removeEntitiesFromPermissionSet(id)}
            type="lib_openclose_remove_circle_outline"
            color={theme.ids.color.option.teal[500]}
          />
        );
      }
    }
  ];

  return (
    <Stack direction="vertical">
      <StackItem>
        <Typography variant="heading-200" component="div">
          {t('in-settings:permissionScope.selection_limited_access')}
        </Typography>
        <Typography variant="body-regular" component="div">
          {description}
        </Typography>
      </StackItem>
      <RoleFormGroup
        htmlFor={`${entityPermissionKey}-role-select`}
        tooltipText={roleTooltipText}
        value={role}
        defaultRole={AreaRole.VIEWER}
        onChange={onChangeRole}
      />
      <Divider />
      <StackItem>
        <Button
          kind="action"
          onClick={() => {
            setSubSlideConfig({
              title: addButtonLabel,
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
          {addButtonLabel}
        </Button>
      </StackItem>
      <EntityTable
        fetchedConfigState={selectedEntities}
        query=""
        orderBy="name"
        orderDirection="ASC"
        onClickItem={noop}
        columnDefinition={columnDefinition}
      />
    </Stack>
  );
}

function getFilteredScopeIds(scopeBindings: ScopeBinding[]): Array<string> {
  return scopeBindings.filter(({ scopeId }) => scopeId !== undefined).map<string>(({ scopeId }) => scopeId!);
}

interface UseSelectEntitiesProps<I> {
  selectedIds: string[];
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
  observable: () => Observable<Result<I[]>>;
}

function useSelectedEntities<I>({
  selectedIds,
  extractId,
  extractName,
  observable
}: UseSelectEntitiesProps<I>): FetchedState<I[]> {
  const fetchedState = useFetchedStateObservable(observable);
  const [data, status, ...rest] = fetchedState;

  if (!data || status !== 'resolved') return fetchedState;

  const filteredData = data
    ?.filter(entity => {
      const id = extractId(entity);
      return selectedIds.includes(id);
    })
    .sort((a, b) => compareIgnoreCase(extractName(a), extractName(b)));

  return [filteredData, status, ...rest];
}
