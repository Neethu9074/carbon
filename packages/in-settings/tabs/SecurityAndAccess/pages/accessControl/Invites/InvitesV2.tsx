/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error
import ShareAndInviteDialogBox from 'promise-loader?global,shareAndInvite!in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import { TrashCan } from '@carbon/icons-react';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Spacer } from '@instana/components';
import { Result } from '@instana/types';

import CarbonDataTableWrapper, {
  DataTableRow,
  Notification
} from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { getPendingInvitationsAsObservable, PendingInvitation, revokeInvitation } from 'in-api/users';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { hasError, isLoading } from 'in-services/util/result';
import { formatDateTime } from 'in-services/formatters/date';
import { USER_INVITE } from 'in-services/tracking/tracking';
import { pendingResult } from 'in-services/fixedObjects';
import UserIcon from 'in-components/UserIcon/UserIcon';
import { config } from 'in-services/config';
import { t, Trans } from 'in-i18n';

const headers = [
  {
    key: 'email',
    header: t('in-settings:tabs.email')
  },
  {
    key: 'groupName',
    header: t('in-settings:tabs.group')
  },
  {
    key: 'expireAt',
    header: t('in-settings:tabs.invitationValidUntil')
  },
  {
    key: 'invitedBy',
    header: t('in-settings:tabs.invitedBy')
  }
];

const tableActions = {
  delete: {
    deleteEntity: ({ email }: PendingInvitation) => revokeInvitation(email)
  }
};

const getEntityName = (entity: PendingInvitation) => {
  return t('in-settings:tabs.inviteWithEmail', { email: entity.email });
};

const customDialogMessage = ({ email }: PendingInvitation) => {
  return (
    <span>
      <Trans
        i18nKey="in-settings:tabs.areYouSureYouWantToRevokeTheInvitationToJoinTheTenant"
        values={{
          tenant: config.tenant,
          email: email
        }}
      />
    </span>
  );
};

const InvitesV2 = () => {
  const { trackCta } = useSegmentTracking();

  const DeferredShareAndInviteDialogBox = createAsyncViewComponent(ShareAndInviteDialogBox);
  const dataTableResult = useObservable(getPendingInvitationsAsObservable, []) ?? pendingResult;
  const loading = isLoading(dataTableResult as Result<PendingInvitation[]>);
  const hasErrors = hasError(dataTableResult as Readonly<Result<any>>);
  const errorMessage = hasErrors
    ? ({
        title: t('in-settings:components.errorFailedToLoadData'),
        subtitle: (dataTableResult as Readonly<Result<PendingInvitation[]>>).errors[0].message,
        kind: 'error'
      } as Notification)
    : null;
  const entities = !loading && !hasErrors ? (dataTableResult as PendingInvitation[]) : [];
  const pageSizes = [20, 50];

  const rows = entities?.map((invite: PendingInvitation) => ({
    email: (
      <HorizontalFlexWrapper>
        <UserIcon size="xs" />
        <Spacer horizontal="xsmall" />
        {invite.email}
      </HorizontalFlexWrapper>
    ),
    groupName: invite.groupName,
    expireAt: formatDateTime(new Date(invite.expireAt)),
    invitedBy: invite.invitedBy,
    id: invite.id,
    rowData: {
      id: invite.id,
      email: invite.email,
      groupName: invite.groupName,
      invitedBy: invite.invitedBy,
      expireAt: formatDateTime(new Date(invite.expireAt))
    }
  }));

  const getMenuItems = (row: DataTableRow<any[]>) => {
    const invite = entities.filter(item => item.id === row.id)[0];
    const { email } = invite;
    return [
      {
        actionType: 'delete',
        icon: <TrashCan />,
        label: t('in-settings:tabs.revokeInvitationForUserWithEmail', { email: email, tenant: config.tenant })
      }
    ];
  };

  return (
    <CarbonDataTableWrapper
      title={t('in-settings:tabs.pendingInvitations')}
      tableHeaders={headers}
      tableRows={rows}
      loading={loading}
      searchPlaceholderText={t('in-settings:components.search')}
      searchAttributes={['email', 'groupName', 'invitedBy']}
      initalSortConfig={{ key: 'email', direction: 'asc' }}
      onCreateNew={() => {
        trackCta(USER_INVITE);
        addActiveDialog(<DeferredShareAndInviteDialogBox inviteOnly permissionToShowInvite />);
      }}
      labelNew={t('in-settings:tabs.inviteUser')}
      getMenuItems={getMenuItems}
      boundedPath="/invites"
      pageSizes={pageSizes}
      enableMultSelect={false}
      getEntityName={getEntityName}
      customDialogMessage={(entity: PendingInvitation) => customDialogMessage(entity)}
      customDialogConfirmLabel={t('in-settings:tabs.revoke')}
      tableActions={tableActions}
      message={errorMessage}
    />
  );
};

export default InvitesV2;
