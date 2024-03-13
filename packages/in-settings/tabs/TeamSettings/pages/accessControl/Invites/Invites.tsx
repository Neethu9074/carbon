/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import InviteUserDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserDialog';
import { getPendingInvitations, PendingInvitation, revokeInvitation } from 'in-api/users';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { USER_INVITE, track } from 'in-services/tracking/tracking';
import { formatDateTime } from 'in-services/formatters/date';
import Gravatar from 'in-components/Gravatar/Gravatar';
import { emptyObject } from 'in-services/fixedObjects';
import { config } from 'in-services/config';
import { t, Trans } from 'in-i18n';

const columnDefinitions = [
  {
    id: 'icon',
    sortable: false,
    width: 6,
    getContent: ({ email }: PendingInvitation) => <Gravatar email={email} />
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

  return (
    <List
      title={t('in-settings:tabs.pendingInvitations')}
      getHeader={defaultHeaderWithCount(t('in-settings:tabs.pendingInvitations'))}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={() => getPendingInvitations([])}
      initialOrderBy="email"
      onCreateNew={() => {
        track(USER_INVITE, emptyObject);
        addActiveDialog(<InviteUserDialog />);
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
