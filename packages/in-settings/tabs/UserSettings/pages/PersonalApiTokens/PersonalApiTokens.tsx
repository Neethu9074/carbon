/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { EventPlaceholder } from '@instana/components/types/components/SvgIcon/types';
import { Observable, create } from '@instana/observables';
import { Link, Message } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  PersonalApiToken,
  deletePersonalApiToken,
  getPersonalApiTokensOfUserAsResultObservable as getPersonalApiTokens
} from 'in-settings/tabs/UserSettings/api/personalApiToken';
import CreatePersonalApiToken from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/CreatePersonalApiToken';
import EditPersonalApiToken from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/EditPersonalApiToken';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { userSettingsPersonalApiTokens } from 'in-settings/navigation/paths';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import IconButton from 'in-components/IconButton/IconButton';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { getTenantsWithUnits } from 'in-api/account';
import { config } from 'in-services/config';
import { user } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

const loadEntities = (userId: string): Observable<PersonalApiToken[]> => {
  const observer = create<PersonalApiToken[]>();
  getPersonalApiTokens(userId).subscribe(it => {
    if (it.progress?.loading) return;

    if (it.data) {
      observer.emit(it.data);
    } else if (it.errors) {
      observer.emitError(it.errors);
    }
  });
  return observer;
};

export default function PersonalApiTokens() {
  // @ts-expect-error no types available
  const userId = user.id;

  const tenantWithUnits = useObservable(getTenantsWithUnits, []);
  const unitsData = tenantWithUnits?.[config.tenant] || [];

  return (
    <>
      {unitsData.length > 1 && (
        <Message type={'neutral'} withIcon>
          <Trans
            i18nKey="in-settings:tabs.personalApiTokenUnits"
            values={{ tenantUnit: config.tenantUnit, tenant: config.tenant }}
          />
        </Message>
      )}
      <List
        title={t('in-settings:tabs.personalApiTokens')}
        getHeader={defaultHeaderWithCount(t('in-settings:tabs.personalApiTokens'))}
        getEntityName={entity => t('in-settings:tabs.personalApiTokenEntityName', { entityName: entity.name })}
        columnDefinitions={columnDefinitions}
        tableActions={tableActions}
        loadEntities={() => loadEntities(userId)}
        initialOrderBy="name"
        onRowClick={item => addActiveDialog(<EditPersonalApiToken onClose={close} current={item} />)}
        onCreateNew={() => addActiveDialog(<CreatePersonalApiToken onClose={close} />)}
        labelNew={t('in-settings:tabs.newPersonalApiToken')}
        searchAttributes={['name', 'tokenId', 'accessGrantingToken']}
        searchPlaceholder={t('in-settings:components.search')}
        noDataMessage={t('in-settings:tabs.noPersonalApiTokens')}
      />
    </>
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    width: 60,
    getContent: (entity: PersonalApiToken) => (
      <Link href={userSettingsPersonalApiTokens} ellipsis onClick={preventDefault}>
        {entity.name}
      </Link>
    )
  },
  {
    id: 'token',
    label: t('in-settings:tabs.token'),
    ellipsis: true,
    getContent: ({ accessGrantingToken }: PersonalApiToken) => (
      <>
        <span>{maskToken(accessGrantingToken)}</span>
        <CopyToClipboard getText={() => accessGrantingToken}>
          {refSetter => (
            <span ref={refSetter}>
              <IconButton onClick={stopPropagationAndPreventDefault} type="lib_actions_copy" />
            </span>
          )}
        </CopyToClipboard>
      </>
    )
  }
];

const preventDefault = (e: EventPlaceholder) => e.preventDefault();

const maskToken = (token: string) => token.substring(0, 4) + '********************';

const tableActions = {
  delete: {
    deleteEntity: (entity: PersonalApiToken) => deletePersonalApiToken(entity.tokenId)
  }
};
