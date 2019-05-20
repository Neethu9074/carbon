import React, { Fragment } from 'react';
import { withState } from 'recompose';

import InviteUserButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserButton';
import { getInvitations, revokeInvitation } from 'in-api/users';
import TemporaryMessage from 'in-components/TemporaryMessage';
import List from 'in-settings/components/List';
import { config } from 'in-services/config';

export default withState('message', 'setMessage', null)(Invites);

function Invites({ message, setMessage }) {
  return (
    <Fragment>
      {message && <TemporaryMessage type={message.type} message={message.message} duration={5000} />}
      <List
        title="Pending Invitations"
        getHeader={getHeader}
        getEntityName={getEntityName}
        columnDefinitions={columnDefinitions}
        tableActions={tableActions}
        initialOrderBy="email"
        loadEntities={getInvitations}
        rightHeader={<InviteUserButton setMessage={setMessage} />}
        searchAttributes={['email']}
      />
    </Fragment>
  );
}

const columnDefinitions = [
  {
    id: 'email',
    label: 'E-Mail',
    width: 100,
    ellipsis: true,
    getContent(entity) {
      return entity.email;
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => revokeInvitation(entity.email),
    confirmLabel: 'Revoke Invitation',
    dialogMessage: invite => (
      <span>
        Are you sure you want to revoke the invitation to join the <strong>{config.tenant}</strong> tenant for{' '}
        <strong>{invite.email}</strong>?
      </span>
    )
  }
};

function getHeader(totalHits) {
  return totalHits ? `Pending Invitations (${totalHits})` : 'Pending Invitations';
}

function getEntityName(entity) {
  return `invitation for e-mail "${entity.email}"`;
}
