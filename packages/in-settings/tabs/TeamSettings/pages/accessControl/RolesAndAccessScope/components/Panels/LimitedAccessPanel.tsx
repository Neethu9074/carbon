/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { Button, Stack, StackItem, SvgIcon, Typography, useTheme } from '@instana/components';
import { PermissionSet, ScopeBinding, Result, OrderDirection } from '@instana/types';
import { Observable } from '@instana/observables';

import {
  AreaRole,
  AreaRoleType,
  AreaRoleWithCustomType,
  AreaRoleWithContributer,
  AreaRolesWithContributer,
  LimitableProductArea,
  ScopedPermissionItem
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import ContributionFilterWrapper from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ContributionFilterWrapper';
import { ContributerFilterWarning } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ContributerFilterWarning/ContributerFilterWarning';
import {
  ConfigurationSummary,
  getConfigurationSummaryMsg
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import SyntheticCommonSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/SyntheticAccessPanels/SyntheticCommonSection';
import {
  EntityPermissionKey,
  PermissionSectionProps
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/PermissionSection';
import EntityTableCellWithOverflow from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EntityTableCellWithOverflow';
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
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import Divider from 'in-components/workspace/Divider/Divider';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface LimitedAccessPanelProps<I extends Object, FORM_TYPE extends MapFormItems>
  extends FormControlProps<FORM_TYPE>,
    Pick<
      PermissionSectionProps<I, FORM_TYPE>,
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
  productArea: LimitableProductArea;
}

export default function LimitedAccessPanel<I extends Object, FORM_TYPE extends MapFormItems>({
  roleTooltipText,
  role,
  form,
  description,
  addButtonLabel,
  entityPermissionKey,
  productArea,
  observable,
  setForm,
  extractId,
  extractName,
  onChangeRole,
  setShowSubSlide,
  setSubSlideConfig
}: LimitedAccessPanelProps<I, FORM_TYPE>) {
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('ASC');
  const theme = useTheme();
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const scopeBindings = permissionSetField?.value[entityPermissionKey] ?? [];

  const selectedIds = getFilteredScopeIds(scopeBindings);
  const selectedEntities = useSelectedEntities({ selectedIds, extractId, extractName, observable, orderDirection });
  const isContributer =
    applicationContributionFilterEnabled &&
    entityPermissionKey === 'applicationIds' &&
    role === AreaRoleWithContributer.CONTRIBUTER;
  const updatePermissionSet = (permissionSet: PermissionSet) => {
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

  const { accessLevelMessage, rolePermissionMessage } = getConfigurationSummaryMsg(
    productArea,
    ScopedPermissionItem.LIMITED_ACCESS,
    role
  );

  const columnDefinition: Array<ColumnDefinition<I>> = [
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
      sortable: false,
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
      {applicationContributionFilterEnabled ? (
        <StackItem>
          <ConfigurationSummary accessLevelMsg={accessLevelMessage} rolePermissionMsg={rolePermissionMessage} />
        </StackItem>
      ) : (
        <StackItem>
          <Typography variant="heading-200" component="div">
            {t('in-settings:permissionScope.selection_limited_access')}
          </Typography>
          <Typography variant="body-regular" component="div">
            {description}
          </Typography>
        </StackItem>
      )}
      {isContributer && (
        <StackItem>
          <Typography variant="heading-200" component="h4">
            {t('in-settings:permissionScope.role_permissions')}
          </Typography>
          <ContributerFilterWarning />
        </StackItem>
      )}
      <StackItem>
        <RoleFormGroup
          htmlFor={`${entityPermissionKey}-role-select`}
          tooltipText={roleTooltipText}
          value={role}
          defaultRole={AreaRole.VIEWER}
          onChange={onChangeRole}
          {...(entityPermissionKey === 'applicationIds' && applicationContributionFilterEnabled
            ? { options: AreaRolesWithContributer }
            : {})}
        />
        {entityPermissionKey === 'syntheticTestIds' && role === AreaRole.OWNER && (
          <SyntheticCommonSection form={form} setForm={setForm} />
        )}
        {isContributer && <ContributionFilterWrapper form={form} setForm={setForm} />}
      </StackItem>
      <Divider />
      {isContributer && (
        <StackItem>
          <Typography variant="heading-200" component="h4">
            {t('in-settings:permissionScope.contribution_filter_accessScope')}
          </Typography>
        </StackItem>
      )}
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
        orderDirection={orderDirection}
        onClickItem={noop}
        onChange={({ orderDirection: dir }) => setOrderDirection(dir ?? orderDirection)}
        columnDefinition={columnDefinition}
        paginated
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
