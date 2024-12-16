/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { EventPlaceholder } from '@instana/components/types/components/SvgIcon/types';
import { Observable, create } from '@instana/observables';
import { IconButton, Link } from '@instana/components';

import {
  PersonalApiToken,
  deletePersonalApiToken,
  getPersonalApiTokensOfUserAsResultObservable as getPersonalApiTokens
} from 'in-settings/tabs/UserSettings/api/personalApiToken';
import CreatePersonalApiToken from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/CreatePersonalApiToken';
import TenantInfoBanner from 'in-settings/tabs/SecurityAndAccess/components/TenantInfoBanner/TenantInfoBanner';
import EditPersonalApiToken from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/EditPersonalApiToken';
import { getApiTokenStatus } from 'in-settings/components/ApiTokenExpiration/utils';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { userSettingsPersonalApiTokens } from 'in-settings/navigation/paths';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { formatDateTime, fromNow } from 'in-services/formatters/date';
import { apiTokenExpirationEnabled } from 'in-services/featureFlags';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { compareIgnoreCase } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip/Tooltip';
import config from 'in-services/config';
import { Trans, t } from 'in-i18n';

import locals from './PersonalApiTokens.mless';

const loadEntities = (): Observable<PersonalApiToken[]> => {
  const observer = create<PersonalApiToken[]>();
  getPersonalApiTokens().subscribe(it => {
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
  return (
    <>
      <TenantInfoBanner>
        <Trans
          i18nKey="in-settings:tabs.personalApiTokenUnits"
          values={{ tenantUnit: config.tenantUnit, tenant: config.tenant }}
        />
      </TenantInfoBanner>
      <List
        title={t('in-settings:tabs.personalApiTokens')}
        getHeader={defaultHeaderWithCount(t('in-settings:tabs.personalApiTokens'))}
        getEntityName={entity => t('in-settings:tabs.personalApiTokenEntityName', { entityName: entity.name })}
        columnDefinitions={columnDefinitions}
        tableActions={tableActions}
        loadEntities={loadEntities}
        initialOrderBy="name"
        onRowClick={item => addActiveDialog(<EditPersonalApiToken onClose={close} current={item} />)}
        onCreateNew={() => addActiveDialog(<CreatePersonalApiToken onClose={close} />)}
        labelNew={t('in-settings:tabs.newPersonalApiToken')}
        searchAttributes={[
          'name',
          'tokenId',
          'accessGrantingToken',
          ...(apiTokenExpirationEnabled ? [(entity: any) => getApiTokenStatus(entity?.expiresOn)] : [])
        ]}
        searchPlaceholder={t('in-settings:components.search')}
        noDataMessage={t('in-settings:tabs.noPersonalApiTokens')}
        customSortEntities={customSortEntities}
      />
    </>
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    width: 30,
    ellipsis: true,
    getContent: (entity: PersonalApiToken) => (
      <Link href={userSettingsPersonalApiTokens} ellipsis onClick={preventDefault}>
        {entity.name}
      </Link>
    )
  },
  {
    id: 'tokenId',
    label: t('in-settings:tabs.token'),
    useMinimumAmountOfHorizontalSpace: true,
    getContent: ({ accessGrantingToken }: PersonalApiToken) => (
      <>
        <span className={locals.tokenLabel}>{maskToken(accessGrantingToken)}</span>
        <CopyToClipboard getText={() => accessGrantingToken}>
          {refSetter => (
            <span ref={refSetter}>
              <IconButton onClick={stopPropagationAndPreventDefault} type="lib_actions_copy" />
            </span>
          )}
        </CopyToClipboard>
      </>
    )
  },
  {
    id: 'lastUsedOn',
    label: t('in-settings:tabs.tokenLastUsed'),
    ellipsis: true,
    useMinimumAmountOfHorizontalSpace: true,
    getContent: ({ lastUsedOn }: PersonalApiToken) => (
      <span>
        {lastUsedOn ? (
          <Tooltip content={`${formatDateTime(lastUsedOn)}`} align="auto" delay={500}>
            <span>{`${fromNow(lastUsedOn)}`}</span>
          </Tooltip>
        ) : (
          ''
        )}
      </span>
    )
  },
  ...(apiTokenExpirationEnabled
    ? [
        {
          id: 'expiresOn',
          label: t('in-settings:tabs.tokenStatus'),
          ellipsis: true,
          useMinimumAmountOfHorizontalSpace: true,
          getContent({ expiresOn }: PersonalApiToken) {
            return getApiTokenStatus(expiresOn);
          }
        }
      ]
    : []),
  {
    id: 'createdOn',
    label: t('in-settings:tabs.tokenCreated'),
    ellipsis: true,
    useMinimumAmountOfHorizontalSpace: true,
    getContent: ({ createdOn }: PersonalApiToken) => (
      <span>
        {createdOn ? (
          <Tooltip content={`${formatDateTime(createdOn)}`} align="auto" delay={500}>
            <span>{`${fromNow(createdOn)}`}</span>
          </Tooltip>
        ) : (
          `${t('in-settings:tabs.unknownLabel')}`
        )}
      </span>
    )
  }
];

const customSortEntities = ({
  entities,
  orderByState,
  orderDirectionState
}: {
  entities: PersonalApiToken[];
  orderByState: keyof PersonalApiToken;
  orderDirectionState: 'ASC' | 'DESC';
}): PersonalApiToken[] => {
  return entities.slice().sort((a, b) => {
    const orderByState1 = a[orderByState];
    const orderByState2 = b[orderByState];

    if (orderByState1 === null || orderByState1 === undefined) return 1;
    if (orderByState2 === null || orderByState2 === undefined) return -1;

    if (orderByState === 'lastUsedOn' || orderByState === 'createdOn') {
      return orderDirectionState === 'ASC'
        ? Number(a[orderByState]) - Number(b[orderByState])
        : Number(b[orderByState]) - Number(a[orderByState]);
    }
    return orderDirectionState === 'ASC'
      ? compareIgnoreCase(orderByState1.toString(), orderByState2.toString())
      : compareIgnoreCase(orderByState2.toString(), orderByState1.toString());
  });
};

const preventDefault = (e: EventPlaceholder) => e.preventDefault();

const maskToken = (token: string) => token.substring(0, 4) + '********************';

const tableActions = {
  delete: {
    deleteEntity: (entity: PersonalApiToken) => deletePersonalApiToken(entity.tokenId)
  }
};
