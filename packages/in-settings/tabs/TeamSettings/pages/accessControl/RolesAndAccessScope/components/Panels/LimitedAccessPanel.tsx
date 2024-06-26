/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React, { useState } from 'react';

import { PermissionSet, ScopeBinding, Result, OrderDirection } from '@instana/types';
import { Stack, StackItem, SvgIcon, Typography } from '@instana/components';
import { Observable } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { Button } from '@instana/legacy';

import {
  AreaRole,
  AreaRoleWithCustomType,
  AreaRoleWithContributor,
  AreaRolesWithContributor,
  LimitableProductArea,
  ScopedPermissionItem,
  AreaRoleWithContributorType,
  AreaRoleType,
  ProductArea,
  ScopeRoles
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import {
  ExtractContributionFilterNameFunction,
  ExtractIdFunction,
  ExtractNameFunction
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/types';
import ContributionFilterWrapper from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ContributionFilterWrapper';
import { ContributorFilterWarning } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/ContributorFilterWarning/ContributorFilterWarning';
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
import PermissionSelection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/PermissionSelection';
import SelectEntitiesForm from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/SelectEntitiesForm';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import RoleFormGroup from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/RoleFormGroup';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import EntityTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import Divider from 'in-components/workspace/Divider/Divider';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { noop } from 'in-services/fixedObjects';
import { Trans, t } from 'in-i18n';

interface LimitedAccessPanelProps<I extends Object, FORM_TYPE extends MapFormItems>
  extends FormControlProps<FORM_TYPE>,
    Pick<
      PermissionSectionProps<I, FORM_TYPE>,
      'setSubSlideConfig' | 'setShowSubSlide' | 'roleTooltipText' | 'entityPermissionKey'
    > {
  role?: AreaRoleWithCustomType;
  addButtonLabel: string;
  entityPermissionKey: EntityPermissionKey;
  observable: () => Observable<Result<I[]>>;
  extractId: ExtractIdFunction<I>;
  extractName: ExtractNameFunction<I>;
  extractContributionFilterName?: ExtractContributionFilterNameFunction<I>;
  onChangeRole: (role: AreaRoleType | AreaRoleWithContributorType) => void;
  productArea: LimitableProductArea;
  setValid?: (isValid: boolean) => void;
  editMode?: boolean;
}

export default function LimitedAccessPanel<I extends Object, FORM_TYPE extends MapFormItems>({
  role,
  form,
  addButtonLabel,
  entityPermissionKey,
  productArea,
  observable,
  setForm,
  extractId,
  extractName,
  extractContributionFilterName,
  onChangeRole,
  setShowSubSlide,
  setSubSlideConfig,
  setValid,
  editMode
}: LimitedAccessPanelProps<I, FORM_TYPE>) {
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('ASC');
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  const scopeBindings = permissionSetField?.value[entityPermissionKey] ?? [];
  const isAppWithContributorFeature = entityPermissionKey === 'applicationIds';
  const isContributor = isAppWithContributorFeature && role === AreaRoleWithContributor.CONTRIBUTOR;
  const isAppContributionFilterConfigured =
    permissionSetField?.value?.restrictedApplicationFilter?.tagFilterExpression?.type !== undefined;
  const restrictingApplicationId = permissionSetField?.value?.restrictedApplicationFilter?.restrictingApplicationId;
  const restrictedApplicationToolTipText = (
    <Trans i18nKey="in-settings:permissionScope.applicationCreatedUsingContributionFilter" />
  );
  const selectedIds = getFilteredScopeIds(scopeBindings); // All ids with valid scopeId (includes ids with contributor access)
  const selectedEntities = useSelectedEntities({
    selectedIds: isAppWithContributorFeature
      ? getFilteredScopeIds(scopeBindings, isAppWithContributorFeature) // Exclude applications with contributor access
      : selectedIds, // Show all selected ids
    extractId,
    extractName,
    observable,
    orderDirection
  });

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

    // For limited application with contributor role additional selected applications should have viewer scope role
    const newScopeRoleId =
      productArea === ProductArea.APPLICATION && role === AreaRoleWithContributor.CONTRIBUTOR
        ? ScopeRoles.Viewer
        : '-1'; // TODO change "-1" to ScopeRoles.Owner once feature is fully integrated
    let newScopes;
    if (newScopeRoleId === ScopeRoles.Viewer) {
      const scopeBindingIds = scopeBindings.map(({ scopeId }) => scopeId);
      const filteredEntityIds = entityIds.filter(id => !scopeBindingIds.includes(id));
      newScopes = filteredEntityIds.map(id => ({ scopeId: id, scopeRoleId: newScopeRoleId }));
    } else {
      newScopes = entityIds.map(id => ({ scopeId: id, scopeRoleId: newScopeRoleId }));
    }

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
        return restrictingApplicationId === id ? (
          <Tooltip content={restrictedApplicationToolTipText} delay={500} align="bottomMiddle">
            <SvgIcon type="lib_help_error_info_outline" />
          </Tooltip>
        ) : (
          <SvgIcon
            aria-label={t('in-settings:PermissionSection.deleteButton', { name })}
            onClick={() => removeEntitiesFromPermissionSet(id)}
            type="lib_openclose_remove_circle_outline"
            color={themes.default.ids.color.option.teal[500]}
          />
        );
      }
    }
  ];

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
  const RoleSelectionSection = () => {
    return (
      <RoleFormGroup
        htmlFor={`${entityPermissionKey}-role-select`}
        value={role}
        defaultRole={AreaRole.VIEWER}
        roleDescription={rolePermissionMessage}
        onChange={onChangeRole}
        {...(entityPermissionKey === 'applicationIds' ? { options: AreaRolesWithContributor } : {})}
      />
    );
  };

  return (
    <Stack direction="vertical">
      <StackItem>
        <ConfigurationSummary accessLevelType={ScopedPermissionItem.LIMITED_ACCESS} accessLevelMsg={accessLevelMessage}>
          {isContributor && isAppContributionFilterConfigured ? <ContributorFilterWarning /> : null}
          <RoleSelectionSection />
          {entityPermissionKey === 'syntheticTestIds' ? (
            <SyntheticCommonSection form={form} setForm={setForm} role={role} />
          ) : (
            <PermissionSelection
              title={t('in-settings:productAreas.additionalPermissions')}
              productAreas={[productArea]}
              icon="lib_actions_settings"
              form={form}
              setForm={setForm}
              hasAdditionalCapabilities
            />
          )}
          {isContributor && (
            <ContributionFilterWrapper
              form={form}
              setForm={setForm}
              isContributorRole={isContributor}
              setValid={setValid}
              editMode={editMode}
            />
          )}
        </ConfigurationSummary>
      </StackItem>
      <Divider />
      {isContributor && (
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
                  extractContributionFilterName={extractContributionFilterName}
                  onClickCancel={() => setShowSubSlide(false)}
                  onClickSave={ids => {
                    updateEntityIds(ids);
                    setShowSubSlide(false);
                  }}
                  productArea={productArea}
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
