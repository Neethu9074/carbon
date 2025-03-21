/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error
import ShareAndInviteDialogBox from 'promise-loader?global,shareAndInvite!in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox';
import React from 'react';

import { KeyValue, Link, Message, MessageTypes, Typography } from '@instana/components';
import { Observable, create } from '@instana/observables';

import { MessageContentModernDesign } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { getEntityIdView, securityAndAccessAccessControlUsers } from 'in-settings/navigation/paths';
import { getUsersAsResultObservable, removeUserFromTenant, UserResult } from 'in-api/users';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useIsAnyIdPActive from 'in-settings/hooks/useIsAnyIdPActive';
import { USER_INVITE } from 'in-services/tracking/tracking';
import UserIcon from 'in-components/UserIcon/UserIcon';
import { noop } from 'in-services/fixedObjects';
import { t, Trans } from 'in-i18n';

export default function Users() {
  const isAnyIDPActive = useIsAnyIdPActive();
  const { trackCta } = useSegmentTracking();

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

  const DeferredShareAndInviteDialogBox = createAsyncViewComponent(ShareAndInviteDialogBox);

  return (
    <>
      {isAnyIDPActive && <CustomUserListInfo />}{' '}
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
                trackCta(USER_INVITE);
                addActiveDialog(<DeferredShareAndInviteDialogBox inviteOnly permissionToShowInvite />);
              }
        }
        labelNew={t('in-settings:tabs.inviteUser')}
        searchAttributes={['fullName', 'email', 'id']}
        searchPlaceholder={t('in-settings:components.search')}
        customDialogMessage={isAnyIDPActive ? (entity: UserResult) => customDialogMessage(entity) : undefined}
        onRowClick={noop}
        boundedPath="/users"
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
    getContent: () => {
      return <UserIcon size="l" />;
    }
  },
  {
    id: 'fullName',
    label: t('in-settings:tabs.name'),
    getContent: ({ fullName, email, id }: UserResult) => (
      <Link href={getEntityIdView(securityAndAccessAccessControlUsers, id)} ellipsis>
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
    <Message type={MessageTypes.neutral} withIcon inline>
      <MessageContentModernDesign>
        <Trans i18nKey="in-settings:tabs.customUserListInformation" />
      </MessageContentModernDesign>
    </Message>
  );
}
