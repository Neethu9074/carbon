/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { Link, Message } from '@instana/components';
import { createLogger } from '@instana/logger';
import { useObservable } from '@instana/hooks';

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
import { ApiTokenProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiToken';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { apiTokenDialogEnabled } from 'in-services/featureFlags';
import { getTenantsWithUnits } from 'in-api/account';
import { config } from 'in-services/config';
import { Trans, t } from 'in-i18n';

import locals from './ApiTokens.mless';

const logger = createLogger('ApiTokens');

export default function ApiTokens() {
  const { goToPath } = useNavigation();

  const tenantWithUnits = useObservable(getTenantsWithUnits, []);
  const unitsData = tenantWithUnits?.[config.tenant] || [];

  return (
    <>
      {unitsData.length > 1 && (
        <Message type={'neutral'} withIcon>
          <Trans
            i18nKey="in-settings:tabs.apiTokenUnits"
            values={{ tenantUnit: config.tenantUnit, tenant: config.tenant }}
          />
        </Message>
      )}

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
        searchAttributes={['name', 'id', 'internalId', 'accessGrantingToken']}
        searchPlaceholder={t('in-settings:components.search')}
        noDataMessage={t('in-settings:tabs.noApiToken')}
        // @ts-expect-error
        getDetailsHref={(entity: any) => {
          getEntityHref(teamSettingsAccessControlApiTokens, entity.internalId);
        }}
      />
    </>
  );
}

function GrantingTokenLabelButton({ apiToken }: { apiToken: ApiTokenProps }) {
  const [accessGrantingToken, updateToken] = useState(apiToken.accessGrantingToken);

  return (
    <div className={locals.apiTokenColContainer}>
      <div>{accessGrantingToken}</div>
      <AsyncTokenCopyButton internalId={apiToken.internalId} token={accessGrantingToken} updateToken={updateToken} />
    </div>
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    width: 60,
    getContent(entity: ApiTokenProps) {
      return (
        <Link href={getEntityIdView(teamSettingsAccessControlApiTokens, entity.internalId)} ellipsis>
          {entity.name}
        </Link>
      );
    }
  },
  {
    id: 'id',
    label: t('in-settings:tabs.token'),
    ellipsis: true,
    getContent(apiToken: ApiTokenProps) {
      return <GrantingTokenLabelButton apiToken={apiToken} />;
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
