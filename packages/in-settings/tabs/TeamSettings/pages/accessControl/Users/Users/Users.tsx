/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { KeyValue, Link, Message, MessageTypes, Typography } from '@instana/components';
import { Observable, create } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import { MessageContentModernDesign } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
//@ts-expect-error TS migration
import { getConfigAsResultObservable as getLdapConfig } from 'in-settings/tabs/AuthSettings/api/ldap';
//@ts-expect-error TS migration
import { getConfigAsResultObservable as getOidcConfig } from 'in-settings/tabs/AuthSettings/api/oidc';
//@ts-expect-error TS migration
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/AuthSettings/api/saml';
import InviteUserDialog, {
  UserInvite
} from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserDialog';
import { onDoInviteUser } from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites//InviteUserButton';
import { getEntityIdView, teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { getUsersAsResultObservable, removeUserFromTenant, UserResult } from 'in-api/users';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { disableInvitesWithIdpEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { USER_INVITE, track } from 'in-services/tracking/tracking';
import Gravatar from 'in-components/Gravatar/Gravatar';
import { emptyObject } from 'in-services/fixedObjects';
import { t, Trans } from 'in-i18n';

export interface ConfigProps {
  activated: boolean;
}

export default function Users() {
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const isSamlConfigured: Result<ConfigProps> | undefined | null = useObservable(getSamlConfig, []);
  const isLdapConfigured: Result<ConfigProps> | undefined | null = useObservable(getLdapConfig, []);
  const isOidcConfigured: Result<ConfigProps> | undefined | null = useObservable(getOidcConfig, []);

  const isAnyIDPActive =
    disableInvitesWithIdpEnabled &&
    (isSamlConfigured?.data?.activated || isLdapConfigured?.data?.activated || isOidcConfigured?.data?.activated);

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

  return (
    <>
      {isAnyIDPActive && <CustomUserListInfo />}
      {message && <Message type={message?.type} withIcon title={message?.text} small />}
      <List
        title={t('in-settings:tabs.users')}
        getHeader={defaultHeaderWithCount(t('in-settings:tabs.users'))}
        getEntityName={({ fullName }: UserResult) => t('in-settings:tabs.userWithName', { name: fullName })}
        columnDefinitions={columnDefinitions}
        tableActions={tableActions}
        loadEntities={loadEntities}
        initialOrderBy="fullName"
        onCreateNew={
          isAnyIDPActive
            ? undefined
            : () => {
                track(USER_INVITE, emptyObject);
                addActiveDialog(
                  <InviteUserDialog
                    onSubmit={(invitations: UserInvite[]) => onDoInviteUser(setMessage, invitations, undefined)}
                  />
                );
              }
        }
        labelNew={t('in-settings:tabs.inviteUser')}
        searchAttributes={['fullName', 'email']}
        searchPlaceholder={t('in-settings:components.search')}
        customDialogMessage={isAnyIDPActive ? (entity: UserResult) => customDialogMessage(entity) : undefined}
      />
    </>
  );
}

const loadEntities = (): Observable<UserResult[]> => {
  const observer = create<UserResult[]>();
  getUsersAsResultObservable([]).subscribe(next => {
    if (next.progress?.loading) return;
    if (next.data) {
      observer.emit(next.data);
    } else if (next.errors) {
      observer.emitError(next.errors);
    }
  });
  return observer;
};

const columnDefinitions = [
  {
    id: 'icon',
    sortable: false,
    width: 6,
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
    width: 15,
    getContent: ({ tfaEnabled }: UserResult) => {
      if (tfaEnabled === true) {
        return <Typography variant="body-regular">{t('in-settings:tabs.tfaEnabled')}</Typography>;
      }
      return <></>;
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: (entity: UserResult) => removeUserFromTenant(entity.id)
  }
};

function CustomUserListInfo() {
  return (
    <Message type={MessageTypes.neutral} withIcon>
      <MessageContentModernDesign>{t('in-settings:tabs.customUserListInformation')}</MessageContentModernDesign>
    </Message>
  );
}
