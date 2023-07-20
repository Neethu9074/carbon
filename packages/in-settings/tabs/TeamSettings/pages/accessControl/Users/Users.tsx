/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { KeyValue, Link, Message, Typography } from '@instana/components';
import { formatDateTime, fromNow } from '@instana/format-date';
import { Observable, create } from '@instana/observables';

import { getEntityIdView, teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { getUsersAsResultObservable, removeUserFromTenant, UserResult } from 'in-api/users';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import InviteUserDialog, { UserInvite } from '../Invites/InviteUserDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { USER_INVITE, track } from 'in-services/tracking/tracking';
import { onDoInviteUser } from '../Invites/InviteUserButton';
import Gravatar from 'in-components/Gravatar/Gravatar';
import { emptyObject } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function Users() {
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>();

  return (
    <>
      {message && <Message type={message?.type} withIcon title={message?.text} small />}
      <List
        title={t('in-settings:tabs.users')}
        getHeader={defaultHeaderWithCount(t('in-settings:tabs.users'))}
        getEntityName={({ fullName }: UserResult) => t('in-settings:tabs.userWithName', { name: fullName })}
        columnDefinitions={columnDefinitions}
        tableActions={tableActions}
        loadEntities={loadEntities}
        initialOrderBy="fullName"
        onCreateNew={() => {
          track(USER_INVITE, emptyObject);
          // @ts-ignore
          addActiveDialog(
            <InviteUserDialog
              onSubmit={(invitations: UserInvite[]) => onDoInviteUser(setMessage, invitations, undefined)}
            />
          );
        }}
        labelNew={t('in-settings:tabs.inviteUser')}
        searchAttributes={['fullName', 'email']}
        searchPlaceholder={t('in-settings:components.search')}
      />
    </>
  );
}

const loadEntities = (): Observable<UserResult[]> => {
  const observer = create<UserResult[]>();
  getUsersAsResultObservable([]).subscribe(({ progress, data, errors }) => {
    if (progress?.loading) return;
    if (data) {
      observer.emit(data);
    } else if (errors) {
      observer.emitError(errors);
    }
  });
  return observer;
};

const columnDefinitions = [
  {
    id: 'icon',
    sortable: false,
    width: 3,
    getContent: ({ email }: UserResult) => <Gravatar email={email} />
  },
  {
    id: 'fullName',
    label: t('in-settings:tabs.name'),
    getContent: ({ fullName, email, id }: UserResult) => (
      <Link href={getEntityIdView(teamSettingsAccessControlUsers, id)} ellipsis>
        <KeyValue value={fullName || t('in-settings:tabs.userDoesNotExist')} label={email} inverted accentuated />
      </Link>
    )
  },
  {
    id: 'groupCount',
    label: t('in-settings:tabs.groupCountCol'),
    width: 10,
    getContent({ groupCount }: UserResult) {
      if (groupCount === undefined) {
        return <></>;
      }
      return <Typography variant="body-regular">{groupCount}</Typography>;
    }
  },
  {
    id: 'tfaEnabled',
    label: t('in-settings:tabs.tfaEnabledCol'),
    width: 8,
    getContent: ({ tfaEnabled }: UserResult) => {
      if (tfaEnabled === true) {
        return <Typography variant="body-regular">{t('in-settings:tabs.tfaEnabled')}</Typography>;
      }
      return <></>;
    }
  },
  {
    id: 'lastLoggedIn',
    label: t('in-settings:tabs.lastLoggedInCol'),
    width: 19,
    getContent: ({ lastLoggedIn }: UserResult) => {
      if (lastLoggedIn)
        return (
          <Typography variant="body-regular">{`${fromNow(lastLoggedIn)} (${formatDateTime(lastLoggedIn)})`}</Typography>
        );
      return <></>;
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: (entity: UserResult) => removeUserFromTenant(entity.id)
  }
};
