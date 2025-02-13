/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error
import ShareAndInviteDialogBox from 'promise-loader?global,shareAndInvite!in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import { TrashCan, UserAvatar } from '@carbon/icons-react';
import React from 'react';

import { Link, Message, MessageTypes, Spacer, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { MessageContentModernDesign } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import CarbonDataTableWrapper, {
  DataTableRow,
  Notification
} from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { getUsersResult, removeUserFromTenant, removeUsersFromTenant, UserResult } from 'in-api/users';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { getEntityIdView, securityAndAccessAccessControlUsers } from 'in-settings/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useIsAnyIdPActive from 'in-settings/hooks/useIsAnyIdPActive';
import { hasError, isLoading } from 'in-services/util/result';
import { USER_INVITE } from 'in-services/tracking/tracking';
import { pendingResult } from 'in-services/fixedObjects';
import { t, Trans } from 'in-i18n';
import { Result } from 'in-types';

const tableActions = {
  delete: {
    deleteEntity: (entity: UserResult) => removeUserFromTenant(entity.id),
    batchDeleteEntity: (selectedIds: string[]) => removeUsersFromTenant(selectedIds)
  }
};
const CustomUserListInfo = () => {
  return (
    <Message type={MessageTypes.neutral} withIcon inline>
      <MessageContentModernDesign>
        <Trans i18nKey="in-settings:tabs.customUserListInformation" />
      </MessageContentModernDesign>
    </Message>
  );
};

const headers = [
  {
    key: 'fullName',
    header: t('in-settings:tabs.name')
  },
  {
    key: 'groupCount',
    header: t('in-settings:tabs.groupCountCol')
  },
  {
    key: 'tfaEnabled',
    header: t('in-settings:tabs.tfaEnabledCol')
  }
];

interface RowObject<ROW_DATA> {
  fullName: JSX.Element;
  groupCount: JSX.Element;
  id: string;
  rowData: ROW_DATA;
  tfaEnabled: JSX.Element;
}

export default function UsersV2() {
  const isAnyIDPActive = useIsAnyIdPActive();
  const { trackCta } = useSegmentTracking();
  const pageSizes = [20, 50];
  const DeferredShareAndInviteDialogBox = createAsyncViewComponent(ShareAndInviteDialogBox);

  const dataTableResult = useObservable(getUsersResult, []) ?? pendingResult;
  const loading = isLoading(dataTableResult as Result<UserResult>);
  const hasErrors = hasError(dataTableResult as Readonly<Result<UserResult[]>>);
  const errorMessage = hasErrors
    ? ({
        title: t('in-settings:components.errorFailedToLoadData'),
        subtitle: (dataTableResult as Readonly<Result<UserResult[]>>).errors[0].message,
        kind: 'error'
      } as Notification)
    : null;
  const entities = !loading && !hasErrors ? (dataTableResult as UserResult[]) : [];
  const rows: Array<RowObject<UserResult>> = entities?.map((user: UserResult) => ({
    fullName: (
      <HorizontalFlexWrapper>
        <UserAvatar />
        <Spacer horizontal="normal" />
        <div>
          <Link href={getEntityIdView(securityAndAccessAccessControlUsers, user.id)} ellipsis>
            {user.fullName || t('in-settings:tabs.userDoesNotExist')}
          </Link>
          <Typography variant="body-small" noMargin component="div">
            {user.email}
          </Typography>
        </div>
      </HorizontalFlexWrapper>
    ),
    groupCount: <span>{user.groupCount ?? <Typography variant="body-regular">{user.groupCount}</Typography>}</span>,
    tfaEnabled: (
      <span>
        {user.tfaEnabled && user.tfaEnabled === true ? (
          <Typography variant="body-regular">{t('in-settings:tabs.tfaEnabled')}</Typography>
        ) : (
          <></>
        )}
      </span>
    ),
    id: user.id,
    rowData: user
  }));

  function customBatchDeleteMessage(users: UserResult[]) {
    return (
      <span>
        <Trans i18nKey="in-settings:tabs.ensureThatTheUserAccessToInstanaIsDisabledInYourIdp" />
        <br />
        <Trans
          i18nKey="in-settings:components.confirmRemoveEntity"
          values={{ entity: t('in-settings:tabs.noOfItemsSelected', { noOfItemsSelected: users.length }) }}
        />
      </span>
    );
  }

  function customDialogMessage({ fullName }: UserResult) {
    return (
      <span>
        <Trans i18nKey="in-settings:tabs.ensureThatTheUserAccessToInstanaIsDisabledInYourIdp" />
        <br />
        <Trans
          i18nKey="in-settings:components.confirmRemoveEntity"
          values={{ entity: t('in-settings:tabs.userWithName', { name: fullName }) }}
        />
      </span>
    );
  }

  const getMenuItems = (row: Omit<DataTableRow<RowObject<UserResult>[], UserResult>, 'rowData'>) => {
    const user = entities.filter(item => item.id === row.id)[0];
    const { fullName } = user;
    return [
      {
        actionType: 'delete',
        icon: <TrashCan />,
        label: t('in-settings:components.deleteEntity', { entity: fullName })
      }
    ];
  };

  const getBatchActionItems = () => {
    return [
      {
        renderIcon: TrashCan,
        actionName: t('in-settings:components.delete'),
        actionType: 'delete'
      }
    ];
  };

  return (
    <>
      {isAnyIDPActive && <CustomUserListInfo />}
      <CarbonDataTableWrapper
        title={t('in-settings:tabs.users')}
        tableHeaders={headers}
        tableRows={rows}
        loading={loading}
        searchPlaceholderText={t('in-settings:components.search')}
        searchAttributes={['fullName', 'email']}
        initalSortConfig={{ key: 'fullName', direction: 'asc' }}
        onCreateNew={
          isAnyIDPActive
            ? undefined
            : () => {
                trackCta(USER_INVITE);
                addActiveDialog(<DeferredShareAndInviteDialogBox inviteOnly permissionToShowInvite />);
              }
        }
        labelNew={t('in-settings:tabs.inviteUser')}
        getMenuItems={getMenuItems}
        getBatchActionItems={getBatchActionItems}
        boundedPath="/users"
        pageSizes={pageSizes}
        tableActions={tableActions}
        customDialogMessage={isAnyIDPActive ? (entity: UserResult) => customDialogMessage(entity) : undefined}
        getEntityName={({ fullName }: UserResult) => t('in-settings:tabs.userWithName', { name: fullName })}
        customBatchDeleteMessage={isAnyIDPActive ? (users: UserResult[]) => customBatchDeleteMessage(users) : undefined}
        message={errorMessage}
      />
    </>
  );
}
