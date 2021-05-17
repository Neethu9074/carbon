/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { createLogger } from '@instana/logger';
import { Link } from '@instana/components';

import {
  getApiTokens,
  deleteApiToken,
  createApiToken
} from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/api';
import { getEntityHref, getEntityIdView, teamSettingsAccessControlApiTokens } from 'in-settings/navigation/paths';
import { buildMaskedToken } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/tokenSuffix';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { generateUniqueShortId } from 'in-services/util/id';
import CopyToClipboard from 'in-components/CopyToClipboard';
import IconButton from 'in-new-components/IconButton';
import { goToPath } from 'in-stores/navigation';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ApiTokens.mless';

const logger = createLogger('ApiTokens');

export default function ApiTokens() {
  return (
    <List
      title={t('in-settings:tabs.apiTokens')}
      getHeader={defaultHeaderWithCount(t('in-settings:tabs.apiTokens'))}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getApiTokens}
      initialOrderBy="name"
      onCreateNew={onCreateNew}
      labelNew={t('in-settings:tabs.addApiToken')}
      searchAttributes={['name', 'id', 'internalId', 'accessGrantingToken']}
      getDetailsHref={entity => getEntityHref(teamSettingsAccessControlApiTokens, entity.internalId)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    width: 60,
    getContent(entity) {
      return (
        <Link href$={getEntityIdView(teamSettingsAccessControlApiTokens, entity.internalId)} ellipsis>
          {entity.name}
        </Link>
      );
    }
  },
  {
    id: 'id',
    label: t('in-settings:tabs.token'),
    ellipsis: true,
    getContent(apiToken) {
      return (
        <div className={locals.apiTokenColContainer}>
          <div>{buildMaskedToken(apiToken.accessGrantingToken)}</div>
          <Tooltip align="topRight" content={t('in-settings:tabs.copyApiTokenToClipboard')}>
            <CopyToClipboard getText={() => apiToken.accessGrantingToken}>
              {refSetter => (
                <span ref={refSetter}>
                  <IconButton
                    onClick={e => {
                      stopPropagationAndPreventDefault(e);
                    }}
                    type="lib_actions_copy"
                  />
                </span>
              )}
            </CopyToClipboard>
          </Tooltip>
        </div>
      );
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteApiToken(entity.internalId)
  }
};

function getEntityName(entity) {
  return t('in-settings:tabs.apiTokenEntityName', { entityName: entity.name });
}

function onCreateNew() {
  const accessGrantingToken = generateUniqueShortId();
  const saveResult$ = createApiToken({
    accessGrantingToken,
    internalId: generateUniqueShortId(),
    name: t('in-settings:tabs.newApiToken')
  });
  // Note: The backend will overwrite the end-user provided IDs during creation.
  saveResult$.once(savedApiToken =>
    goToPath(getEntityHref(teamSettingsAccessControlApiTokens, savedApiToken.internalId || savedApiToken.id))
  );
  saveResult$.errors().once(error => {
    logger.error(`Failed to save new API token: ${error.message}`, error);
  });
}
