/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Edit, TrashCan } from '@carbon/icons-react';
import React, { useState } from 'react';

import { Link, Typography, Spacer } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Checkbox } from '@instana/carbon';

import {
  ROLE_MAPPING_TABLE_BATCH_ACTIONS,
  ROLE_MAPPING_TABLE_HEADERS,
  ROLE_MAPPING_TABLE_PAGE_SIZES,
  ROLE_MAPPING_TABLE_ORDER
} from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMapping.constants';
import {
  ENTERPRISE_IDP_MAPPING_CREATE_CLICK,
  ENTERPRISE_IDP_MAPPING_REMOVED,
  ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS,
  ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS_REMOVE
} from 'in-services/tracking/tracking';
import {
  deleteMapping,
  deleteMappings,
  getMappings,
  getIdpRestriction,
  IdpGroupMapping,
  setIdpRestriction
} from 'in-settings/tabs/SecurityAndAccess/api/groupMappings';
import MultiSelectDataTable, {
  DataTableRow,
  Notification,
  OverflowMenuItemProps,
  TableActions
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { createRoleMappingForm } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMapping.form';
import RoleMappingTearsheet from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMappingTearsheet';
import { RoleMappingRow } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMapping.types';
import { getEntityIdView, securityAndAccessAccessControlTeams } from 'in-settings/navigation/paths';
import { CtaTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useAuthOverview from 'in-settings/hooks/useAuthOverview';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import useDerivedState from 'in-hooks/useDerivedState';
import { seconds } from 'in-services/time/time';
import { t, Trans } from 'in-i18n';

import locals from './RoleMapping.mless';

const createMenuItemsForRow = (
  roleMappings: IdpGroupMapping[],
  row: Omit<DataTableRow<RoleMappingRow<IdpGroupMapping>[], IdpGroupMapping>, 'rowData'>,
  setMessage: React.Dispatch<React.SetStateAction<Notification | undefined>>
): Array<OverflowMenuItemProps> => {
  const roleMapping = roleMappings.filter(item => item.id === row.id)[0];
  const { key } = roleMapping;
  return [
    {
      actionType: 'edit',
      icon: <Edit />,
      label: t('in-settings:components.editEntity', { entity: key }),
      onClick: () => addActiveDialog(<RoleMappingTearsheet roleMapping={roleMapping} setMessage={setMessage} />)
    },
    {
      actionType: 'delete',
      icon: <TrashCan />,
      label: t('in-settings:components.deleteEntity', { entity: key })
    }
  ];
};

const createTableRows = (
  roleMappings: IdpGroupMapping[] = [],
  createHrefToPath: (path: string) => string
): Array<RoleMappingRow<IdpGroupMapping>> => {
  return roleMappings?.map((roleMapping: IdpGroupMapping) => ({
    key: (
      <Link
        href={getEntityIdView(securityAndAccessAccessControlTeams, roleMapping?.id ?? '', createHrefToPath)}
        ellipsis
      >
        {roleMapping.key}
      </Link>
    ),
    value: (
      <span>
        <Typography variant="body-regular">{roleMapping.value}</Typography>
      </span>
    ),
    role: <span>{roleMapping.groupId}</span>,
    team: <span>{roleMapping.teamId}</span>,
    id: roleMapping?.id ?? '',
    rowData: { ...roleMapping }
  }));
};

const createRoleMappingTableActions = (trackCta: CtaTrackingFunction): TableActions<IdpGroupMapping> => {
  return {
    delete: {
      deleteEntity: entity => {
        // Segment tracking
        trackCta(ENTERPRISE_IDP_MAPPING_REMOVED, { mappingId: entity.id });
        return deleteMapping(entity?.id ?? '');
      },
      batchDeleteEntity: selectedIds => {
        // Segment tracking
        trackCta(ENTERPRISE_IDP_MAPPING_REMOVED, { mappingIds: selectedIds });
        return deleteMappings(selectedIds);
      }
    }
  };
};

const RoleMapping = () => {
  const [authOverview] = useAuthOverview();
  const { defaultLogin } = authOverview ?? {};
  const idpRestrictionResult = useObservable(getIdpRestriction, []) ?? pendingResult;
  const [form, setForm] = useDerivedState(createRoleMappingForm(idpRestrictionResult?.data?.restrictEmptyIdpGroups));
  const idpDenyAccessField = form.getIn(['restrictEmptyIdpRoles']);
  const dataTableResult = useObservable(getMappings, []) ?? pendingResult;
  const loading = isLoading(dataTableResult);
  const hasErrors = hasError(dataTableResult);
  const [message, setMessage] = useState<Notification>();
  const { createHrefToPath } = useNavigation();
  const { trackCta } = useSegmentTracking();

  const errorMessage: Notification | undefined = hasErrors
    ? {
        title: t('in-settings:components.errorFailedToLoadData'),
        subtitle: dataTableResult.errors[0].message,
        kind: 'error'
      }
    : undefined;

  if (defaultLogin) {
    // Show message to configure IdP first as mapping can only be configured with an active IdP.
    return (
      <>
        <Typography variant="heading-03">{t('in-settings:tabs.roleMapping.title')}</Typography>
        <Spacer vertical="normal" />
        <Typography variant="body-01">
          <Trans
            i18nKey="in-settings:tabs.roleMapping.roleMappingDisabledDescription"
            components={{
              docLinkMapping: (
                // @ts-expect-error no children needed
                <Link external href="https://ibm.biz/idp-group-mapping" />
              ),
              docLinkAuth: (
                // @ts-expect-error no children needed
                <Link external href="https://ibm.biz/configuring-authentication" />
              )
            }}
          />
        </Typography>
      </>
    );
  } else {
    return (
      <div className={locals.hideRoleMappingTableHeader}>
        <form>
          <Typography variant="heading-03">{t('in-settings:tabs.roleMapping.title')}</Typography>
          <Spacer vertical="normal" />
          <Typography variant="body-01">
            <Trans
              i18nKey="in-settings:tabs.roleMapping.description"
              components={{
                docLink: (
                  // @ts-expect-error no children needed
                  <Link external href="https://ibm.biz/configuring-authentication" />
                )
              }}
            />
          </Typography>
          <Spacer vertical="normal" />
          <Checkbox
            id="rbac-role-mapping-restrict-empty-idp-roles"
            labelText={t('in-settings:tabs.roleMapping.restrictEmptyIdpRolesLabel')}
            checked={idpDenyAccessField.value}
            onChange={(_e, { checked: enabled }) => {
              setForm(form.updateIn(['restrictEmptyIdpRoles'], f => f.setValue(enabled).setTouched(true)));

              // Segment tracking
              if (enabled) {
                trackCta(ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS);
              } else {
                trackCta(ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS_REMOVE);
              }

              setIdpRestriction({ restrictEmptyIdpGroups: enabled }).once(
                () =>
                  addMessage({
                    title: t('in-settings:components.successTitle'),
                    content: t('in-settings:tabs.roleMapping.restrictEmptyIdpRolesSuccessfullySaved'),
                    timeout: seconds.toMillis(4),
                    type: 'success'
                  }),
                error =>
                  addMessage({
                    content: t('in-settings:tabs.roleMapping.restrictEmptyIdpRolesFailedToSave', {
                      err: error.message
                    }),
                    timeout: seconds.toMillis(6),
                    type: 'danger'
                  })
              );
            }}
          />
          <Spacer vertical="normal" />
        </form>

        <MultiSelectDataTable
          boundedPath="/roleMapping"
          getBatchActionItems={() => ROLE_MAPPING_TABLE_BATCH_ACTIONS}
          getEntityName={({ key }) => t('in-settings:tabs.roleMapping.roleMappingWithName', { name: key })}
          getMenuItems={row => createMenuItemsForRow(dataTableResult.data, row, setMessage)}
          initalSortConfig={ROLE_MAPPING_TABLE_ORDER}
          labelNew={t('in-settings:tabs.roleMapping.newMappingRule')}
          loading={loading}
          message={errorMessage || message}
          onCreateNew={() => {
            // Segment tracking
            trackCta(ENTERPRISE_IDP_MAPPING_CREATE_CLICK);
            addActiveDialog(<RoleMappingTearsheet setMessage={setMessage} />);
          }}
          pageSizes={ROLE_MAPPING_TABLE_PAGE_SIZES}
          searchAttributes={['key', 'value', 'groupId', 'teamId']}
          searchPlaceholderText={t('in-settings:components.search')}
          tableActions={createRoleMappingTableActions(trackCta)}
          tableHeaders={ROLE_MAPPING_TABLE_HEADERS}
          tableRows={createTableRows(dataTableResult.data, createHrefToPath)}
          title={t('in-settings:tabs.roleMapping.tableTitle')}
        />
      </div>
    );
  }
};

export default RoleMapping;
