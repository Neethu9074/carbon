/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error
import ShareAndInviteDialogBox from 'promise-loader?global,shareAndInvite!in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import React from 'react';

//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import InviteUserDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserDialog';
import { getPendingInvitations, PendingInvitation, revokeInvitation } from 'in-api/users';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import { formatDateTime } from 'in-services/formatters/date';
import { USER_INVITE } from 'in-services/tracking/tracking';
import UserIcon from 'in-components/UserIcon/UserIcon';
import { config } from 'in-services/config';
import { t, Trans } from 'in-i18n';

const columnDefinitions = [
  {
    id: 'icon',
    sortable: false,
    width: 6,
    getContent: () => {
      return <UserIcon size="l" />;
    }
  },
  {
    id: 'email',
    label: t('in-settings:tabs.email'),
    getContent: ({ email }: PendingInvitation) => email
  },
  {
    id: 'group',
    label: t('in-settings:tabs.group'),
    getContent: ({ groupName }: PendingInvitation) => groupName
  },
  {
    id: 'validUntil',
    label: t('in-settings:tabs.invitationValidUntil'),
    width: 15,
    getValue: ({ expireAt }: PendingInvitation) => expireAt,
    getContent: ({ expireAt }: PendingInvitation) => formatDateTime(new Date(expireAt))
  },
  {
    id: 'invitedBy',
    label: t('in-settings:tabs.invitedBy'),
    width: 15,
    getContent: ({ invitedBy }: PendingInvitation) => invitedBy
  }
];

const tableActions = {
  delete: {
    deleteEntity: ({ email }: PendingInvitation) => revokeInvitation(email)
  }
};

const Invites = () => {
  const { trackCta } = useSegmentTracking();

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

  const DeferredShareAndInviteDialogBox = createAsyncViewComponent(ShareAndInviteDialogBox);

  return (
    <List
      title={t('in-settings:tabs.pendingInvitations')}
      getHeader={defaultHeaderWithCount(t('in-settings:tabs.pendingInvitations'))}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={() => getPendingInvitations([])}
      initialOrderBy="email"
      onCreateNew={() => {
        trackCta(USER_INVITE);
        addActiveDialog(
          shareAndInviteEnabled ? (
            <DeferredShareAndInviteDialogBox inviteOnly permissionToShowInvite />
          ) : (
            <InviteUserDialog />
          )
        );
      }}
      labelNew={t('in-settings:tabs.inviteUser')}
      searchAttributes={['email', 'groupName', 'invitedBy']}
      searchPlaceholder={t('in-settings:components.search')}
      customDialogMessage={(entity: PendingInvitation) => customDialogMessage(entity)}
      customDialogConfirmLabel={t('in-settings:tabs.revoke')}
      customDeleteTooltipMessage={(entity: PendingInvitation) =>
        t('in-settings:tabs.revokeInvitationForUserWithEmail', { email: entity.email, tenant: config.tenant })
      }
      boundedPath="/invites"
    />
  );
};

export default Invites;
