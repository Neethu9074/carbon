/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue, Link, Typography } from '@instana/components';
import { Observable, create } from '@instana/observables';
import { formatDateTime } from '@instana/format-date';

import InviteUserButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserButton';
import { getEntityIdView, teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { getUsersAsResultObservable, removeUserFromTenant } from 'in-api/users';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Gravatar from 'in-components/Gravatar/Gravatar';
import { t } from 'in-i18n';

interface TenantUserApiResponse {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly lastLoggedIn: number;
  readonly groupCount: number;
  readonly tfaEnabled: boolean | undefined | null;
}

// TODO handle both tenantUserList and Groups part
export default function Users() {
  return (
    <List
      title={t('in-settings:tabs.users')}
      getHeader={defaultHeaderWithCount(t('in-settings:tabs.users'))}
      getEntityName={({ fullName }: TenantUserApiResponse) => t('in-settings:tabs.name', { entityName: fullName })}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={loadEntities}
      initialOrderBy="fullName"
      //onRowClick={item => goToPath(getUserLink(item)))}
      onCreateNew={() => addActiveDialog(<InviteUserButton setMessage={() => {}} reload={false} />)}
      labelNew={t('in-settings:tabs.inviteUser')}
      searchAttributes={['fullName', 'email']}
      searchPlaceholder={t('in-settings:components.search')}
    />
  );
}

const loadEntities = (): Observable<TenantUserApiResponse[]> => {
  const observer = create<TenantUserApiResponse[]>();
  getUsersAsResultObservable([]).subscribe(it => {
    if (it.progress?.loading) return;

    if (it.data) {
      observer.emit(
        // @ts-ignore
        it.data.map(it => ({
          id: it.id,
          email: it.email,
          fullName: it.fullName,
          lastLoggedIn: it.lastLoggedIn,
          groupCount: it.groupCount,
          tfaEnabled: it.tfaEnabled
        }))
      );
    } else if (it.errors) {
      observer.emitError(it.errors);
    }
  });
  return observer;
};

const columnDefinitions = [
  {
    id: 'icon',
    sortable: false,
    width: 3,
    getContent: ({ email }: TenantUserApiResponse) => <Gravatar email={email} />
  },
  {
    id: 'fullName',
    label: t('in-settings:tabs.name'),
    getContent: ({ fullName, email, id }: TenantUserApiResponse) => (
      <Link href={getEntityIdView(teamSettingsAccessControlUsers, id)} ellipsis>
        <KeyValue value={fullName || t('in-settings:tabs.userDoesNotExist')} label={email} inverted accentuated />
      </Link>
    )
  },
  {
    id: 'groupCount',
    label: 'Number of Groups',
    width: 10,
    getContent({ groupCount }: TenantUserApiResponse) {
      if (groupCount === undefined) {
        return <></>;
      }
      return <Typography variant="body-regular">{groupCount}</Typography>;
    }
  },
  {
    id: 'tfaEnabled',
    label: 'Authentication',
    width: 8,
    getContent: ({ tfaEnabled }: TenantUserApiResponse) => {
      if (tfaEnabled === true) {
        return <Typography variant="body-regular">{t('in-settings:tabs.tfaEnabled')}</Typography>;
      }
      return <></>;
    }
  },
  {
    id: 'lastLoggedIn',
    label: 'Last logged in',
    width: 12,
    getContent: ({ lastLoggedIn }: TenantUserApiResponse) => {
      if (lastLoggedIn) return <Typography variant="body-regular">{formatDateTime(lastLoggedIn)}</Typography>;
      return <></>;
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: (entity: TenantUserApiResponse) => removeUserFromTenant(entity.id)
  }
};
