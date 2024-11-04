/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { create, Observable } from '@instana/observables';
import { IconButton, Link } from '@instana/components';

import {
  getEntityHref,
  getEntityIdView,
  securityAndAccessAccessControlApiTokens,
  securityAndAccessAccessControlApiTokenNew
} from 'in-settings/navigation/paths';
import {
  getApiTokens,
  deleteApiToken,
  getTokenIdByAccessGrantingToken
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/api';
import AsyncTokenCopyButton from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/AsyncTokenCopyButton';
import TenantInfoBanner from 'in-settings/tabs/SecurityAndAccess/components/TenantInfoBanner/TenantInfoBanner';
import { ApiTokenProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiToken';
import List, { defaultHeaderWithCount, filterReducer } from 'in-settings/components/List';
import { getApiTokenStatus } from 'in-settings/components/ApiTokenExpiration/utils';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { fromNow, formatDateTime } from 'in-services/formatters/date';
import { apiTokenExpirationEnabled } from 'in-services/featureFlags';
import { compareIgnoreCase } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import config from 'in-services/config';
import { Trans, t } from 'in-i18n';

import locals from './ApiTokens.mless';

const loadEntities = (): Observable<ApiTokenProps[]> => {
  const observer = create<ApiTokenProps[]>();
  getApiTokens([]).subscribe(next => {
    if (next.progress?.loading) return;
    if (next.data) {
      observer.emit(next.data);
    } else if (next.errors) {
      observer.emitError(next.errors);
    }
  });
  return observer;
};

export default function ApiTokens() {
  const { goToPath } = useNavigation();
  const [filteredTokenId, setFilteredTokenId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchAttributes = [
    'name',
    'id',
    'internalId',
    'accessGrantingToken',
    'createdBy',
    ...(apiTokenExpirationEnabled ? [(entity: any) => getApiTokenStatus(entity?.expiresOn)] : [])
  ];

  const columnDefinitions = [
    {
      id: 'name',
      label: t('in-settings:tabs.name'),
      width: 30,
      ellipsis: true,
      useMinimumAmountOfHorizontalSpace: true,
      getContent(entity: ApiTokenProps) {
        return (
          <Link href={getEntityIdView(securityAndAccessAccessControlApiTokens, entity.internalId)} ellipsis>
            {entity.name}
          </Link>
        );
      }
    },
    {
      id: 'internalId',
      label: t('in-settings:tabs.token'),
      ellipsis: true,
      useMinimumAmountOfHorizontalSpace: true,
      getContent(apiToken: ApiTokenProps) {
        return <GrantingTokenLabelButton apiToken={apiToken} />;
      }
    },
    {
      id: 'lastUsedOn',
      label: t('in-settings:tabs.tokenLastUsed'),
      ellipsis: true,
      useMinimumAmountOfHorizontalSpace: true,
      getContent({ lastUsedOn }: ApiTokenProps) {
        return (
          <span>
            {lastUsedOn ? (
              <Tooltip content={`${formatDateTime(lastUsedOn)}`} align="auto" delay={500}>
                <span> {`${fromNow(lastUsedOn)}`} </span>
              </Tooltip>
            ) : (
              ''
            )}
          </span>
        );
      }
    },
    ...(apiTokenExpirationEnabled
      ? [
          {
            id: 'expiresOn',
            label: t('in-settings:tabs.tokenStatus'),
            ellipsis: true,
            useMinimumAmountOfHorizontalSpace: true,
            getContent({ expiresOn }: ApiTokenProps) {
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
      getContent({ createdOn }: ApiTokenProps) {
        return (
          <span>
            {createdOn ? (
              <Tooltip content={`${formatDateTime(createdOn)}`} align="auto" delay={500}>
                <span> {`${fromNow(createdOn)}`} </span>
              </Tooltip>
            ) : (
              `${t('in-settings:tabs.unknownLabel')}`
            )}
          </span>
        );
      }
    },
    {
      id: 'createdBy',
      label: t('in-settings:tabs.tokenCreatedBy'),
      ellipsis: true,
      useMinimumAmountOfHorizontalSpace: true,
      getContent({ createdBy }: ApiTokenProps) {
        return (
          <span>
            {createdBy ? (
              <Tooltip content={createdBy} align="auto" delay={500}>
                <span>{createdBy}</span>
              </Tooltip>
            ) : (
              `${t('in-settings:tabs.unknownLabel')}`
            )}
          </span>
        );
      }
    },
    {
      id: 'duplicateAction',
      sortable: false,
      width: '4rem',
      widthInAbsoluteUnit: true,
      getContent: (e: ApiTokenProps) => {
        return (
          <Tooltip content={t('in-settings:tabs.apiTokenDuplicate')}>
            <IconButton
              kind="action"
              type="lib_actions_copy"
              onClick={() => goToPath(`${securityAndAccessAccessControlApiTokenNew}/${e.internalId}`)}
            />
          </Tooltip>
        );
      }
    }
  ];

  /**
   * Retrieve token internal id for a complete access token string
   * @param {query: string} entered search query
   * @returns void
   */
  const onSearch = (query: string) => {
    setFilteredTokenId('');
    setSearchQuery(query);
    // Only search for token id if query matches token length (API call will fail in other cases)
    if (query?.length === 16 || query?.length === 22) {
      const getTokenIdObsvervable = getTokenIdByAccessGrantingToken(query);
      getTokenIdObsvervable.once(data => {
        setFilteredTokenId(data);
      });
    }
  };

  /**
   * Custom filter function that performs normal search based on specified search attributes
   * and adds results from full token search. This replaces the default search logic
   * of the List component.
   * @param {entities: ApiTokenProps[]} entities to filter
   * @returns filtered entities
   */
  const onFilter = (entities: ApiTokenProps[]) => {
    let filteredEntities: ApiTokenProps[] = [];

    // Default search based on search attributes
    filteredEntities = entities.filter(entity =>
      searchAttributes.reduce(filterReducer.bind(null, searchQuery, entity), false)
    );

    // Add results for full token search
    if (filteredTokenId !== '' && entities) {
      filteredEntities.push(
        ...entities.filter(
          (entity: ApiTokenProps) =>
            entity.internalId === filteredTokenId &&
            !filteredEntities.some((elem: ApiTokenProps) => elem.internalId === filteredTokenId) // prevent duplicate results
        )
      );
    }

    return filteredEntities;
  };

  return (
    <>
      <TenantInfoBanner>
        <Trans
          i18nKey="in-settings:tabs.apiTokenUnits"
          values={{ tenantUnit: config.tenantUnit, tenant: config.tenant }}
        />
      </TenantInfoBanner>
      <List
        title={t('in-settings:tabs.apiTokens')}
        getHeader={defaultHeaderWithCount(t('in-settings:tabs.apiTokens'))}
        getEntityName={getEntityName}
        columnDefinitions={columnDefinitions}
        tableActions={tableActions}
        loadEntities={() => loadEntities()}
        initialOrderBy="name"
        onSearch={onSearch}
        onFilter={onFilter}
        onCreateNew={() => onCreateNew(goToPath)}
        labelNew={t('in-settings:tabs.newApiToken')}
        searchPlaceholder={t('in-settings:components.search')}
        noDataMessage={t('in-settings:tabs.noApiToken')}
        //@ts-expect-error
        getDetailsHref={(entity: any) => {
          getEntityHref(securityAndAccessAccessControlApiTokens, entity.internalId);
        }}
        customSortEntities={customSortEntities}
      />
    </>
  );
}

function GrantingTokenLabelButton({ apiToken }: { apiToken: ApiTokenProps }) {
  const [accessGrantingToken, updateToken] = useState(apiToken.accessGrantingToken);

  return (
    <div className={locals.apiTokenColContainer}>
      <Tooltip content={accessGrantingToken} align="topLeft" delay={500}>
        <div>{accessGrantingToken}</div>
      </Tooltip>
      <AsyncTokenCopyButton internalId={apiToken.internalId} token={accessGrantingToken} updateToken={updateToken} />
    </div>
  );
}

const tableActions = {
  delete: {
    deleteEntity: (entity: ApiTokenProps) => deleteApiToken(entity.internalId)
  }
};

function getEntityName(entity: ApiTokenProps) {
  return t('in-settings:tabs.apiTokenEntityName', { entityName: entity.name });
}

function onCreateNew(goToPath: Function) {
  goToPath(securityAndAccessAccessControlApiTokenNew);
}

const customSortEntities = ({
  entities,
  orderByState,
  orderDirectionState
}: {
  entities: ApiTokenProps[];
  orderByState: keyof ApiTokenProps;
  orderDirectionState: 'ASC' | 'DESC';
}): ApiTokenProps[] => {
  return entities?.slice().sort((a, b) => {
    const orderByState1 = a[orderByState];
    const orderByState2 = b[orderByState];

    if (orderByState1 === null || orderByState1 === undefined) return 1;
    if (orderByState2 === null || orderByState2 === undefined) return -1;

    if (
      orderByState === 'lastUsedOn' ||
      orderByState === 'createdOn' ||
      (apiTokenExpirationEnabled && orderByState === 'expiresOn')
    ) {
      return orderDirectionState === 'ASC'
        ? Number(a[orderByState]) - Number(b[orderByState])
        : Number(b[orderByState]) - Number(a[orderByState]);
    } else if (orderByState === 'createdBy') {
      return orderDirectionState === 'ASC'
        ? compareIgnoreCase(a.createdBy ?? '', b.createdBy ?? '')
        : compareIgnoreCase(b.createdBy ?? '', a.createdBy ?? '');
    }

    return orderDirectionState === 'ASC'
      ? compareIgnoreCase(orderByState1.toString(), orderByState2.toString())
      : compareIgnoreCase(orderByState2.toString(), orderByState1.toString());
  });
};
