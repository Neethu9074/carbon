/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { createLogger } from '@instana/logger';
import { Link } from '@instana/components';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAccessControlApiTokens,
  teamSettingsAccessControlApiTokenNew
} from 'in-settings/navigation/paths';
import {
  getApiTokens,
  deleteApiToken,
  createApiToken
} from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/api';
import AsyncTokenCopyButton from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/AsyncTokenCopyButton';
import TenantInfoBanner from 'in-settings/tabs/TeamSettings/components/TenantInfoBanner/TenantInfoBanner';
import { ApiTokenProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiToken';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { fromNow, formatDateTime } from 'in-services/formatters/date';
import { apiTokenDialogEnabled } from 'in-services/featureFlags';
import { compareIgnoreCase } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import config from 'in-services/config';
import { Trans, t } from 'in-i18n';

import locals from './ApiTokens.mless';

const logger = createLogger('ApiTokens');

export default function ApiTokens() {
  const { goToPath } = useNavigation();

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
        loadEntities={() => getApiTokens()}
        initialOrderBy="name"
        onCreateNew={() => onCreateNew(goToPath)}
        labelNew={t('in-settings:tabs.newApiToken')}
        searchAttributes={['name', 'id', 'internalId', 'accessGrantingToken', 'createdBy']}
        searchPlaceholder={t('in-settings:components.search')}
        noDataMessage={t('in-settings:tabs.noApiToken')}
        // @ts-expect-error
        getDetailsHref={(entity: any) => {
          getEntityHref(teamSettingsAccessControlApiTokens, entity.internalId);
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

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    width: 30,
    ellipsis: true,
    useMinimumAmountOfHorizontalSpace: true,
    getContent(entity: ApiTokenProps) {
      return (
        <Tooltip content={entity.name} align="topLeft" delay={500}>
          <Link href={getEntityIdView(teamSettingsAccessControlApiTokens, entity.internalId)} ellipsis>
            {entity.name}
          </Link>
        </Tooltip>
      );
    }
  },
  {
    id: 'id',
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
            <Tooltip content={`${fromNow(lastUsedOn)} (${formatDateTime(lastUsedOn)})`} align="topLeft" delay={500}>
              <span> {`${fromNow(lastUsedOn)} (${formatDateTime(lastUsedOn)})`} </span>
            </Tooltip>
          ) : (
            ''
          )}
        </span>
      );
    }
  },
  {
    id: 'createdOn',
    label: t('in-settings:tabs.tokenCreated'),
    ellipsis: true,
    useMinimumAmountOfHorizontalSpace: true,
    getContent({ createdOn }: ApiTokenProps) {
      return (
        <span>
          {createdOn ? (
            <Tooltip content={`${fromNow(createdOn)} (${formatDateTime(createdOn)})`} align="topLeft" delay={500}>
              <span> {`${fromNow(createdOn)} (${formatDateTime(createdOn)})`} </span>
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
            <Tooltip content={createdBy} align="topLeft" delay={500}>
              <span>{createdBy}</span>
            </Tooltip>
          ) : (
            `${t('in-settings:tabs.unknownLabel')}`
          )}
        </span>
      );
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: (entity: ApiTokenProps) => deleteApiToken(entity.internalId)
  }
};

function getEntityName(entity: ApiTokenProps) {
  return t('in-settings:tabs.apiTokenEntityName', { entityName: entity.name });
}

function onCreateNew(goToPath: Function) {
  if (apiTokenDialogEnabled) {
    goToPath(teamSettingsAccessControlApiTokenNew);
  } else {
    const accessGrantingToken = generateUniqueShortId();
    const saveResult$ = createApiToken({
      accessGrantingToken,
      internalId: generateUniqueShortId(),
      name: t('in-settings:tabs.newApiToken')
    });
    // Note: The backend will overwrite the end-user provided IDs during creation.
    saveResult$.once((savedApiToken: ApiTokenProps) =>
      goToPath(getEntityHref(teamSettingsAccessControlApiTokens, savedApiToken.internalId || savedApiToken.id))
    );
    saveResult$.errors().once((error: any) => {
      logger.error(`Failed to save new API token: ${error.message}`, error);
    });
  }
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
  return entities.sort((a, b) => {
    if (a[orderByState] === null) return 1;
    if (b[orderByState] === null) return -1;
    if (orderByState === 'lastUsedOn' || orderByState === 'createdOn') {
      return orderDirectionState === 'ASC'
        ? Number(a[orderByState]) - Number(b[orderByState])
        : Number(b[orderByState]) - Number(a[orderByState]);
    }
    if (orderByState === 'createdBy') {
      return orderDirectionState === 'ASC'
        ? compareIgnoreCase(a.createdBy ?? '', b.createdBy ?? '')
        : compareIgnoreCase(b.createdBy ?? '', a.createdBy ?? '');
    }
    return orderDirectionState === 'ASC'
      ? compareIgnoreCase(a[orderByState].toString(), b[orderByState].toString())
      : compareIgnoreCase(b[orderByState].toString(), a[orderByState].toString());
  });
};
