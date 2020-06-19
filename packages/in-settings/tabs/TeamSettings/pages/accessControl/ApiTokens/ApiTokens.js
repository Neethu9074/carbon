import { createLogger } from 'instalog';
import { Map } from 'immutable';
import React from 'react';

import { getEntityHref, getEntityIdView, teamSettingsAccessControlApiTokens } from 'in-settings/navigation/paths';
import { getApiTokensMutable, deleteApiToken, saveApiToken } from 'in-api/apiTokens';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import { generateUniqueShortId } from 'in-services/util/id';
import CopyToClipboard from 'in-components/CopyToClipboard';
import IconButton from 'in-new-components/IconButton';
import { goToPath } from 'in-stores/navigation';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './ApiTokens.mless';

const logger = createLogger('ApiTokens');

export default function ApiTokens() {
  return (
    <List
      title="API Tokens"
      getHeader={defaultHeaderWithCount('API Tokens')}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getApiTokensMutable}
      initialOrderBy="name"
      onCreateNew={onCreateNew}
      labelNew="Add API Token"
      searchAttributes={['name', 'id']}
      getDetailsHref={entity => getEntityHref(teamSettingsAccessControlApiTokens, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    width: 60,
    getContent(entity) {
      return (
        <Link href$={getEntityIdView(teamSettingsAccessControlApiTokens, entity.id)} ellipsis>
          {entity.name}
        </Link>
      );
    }
  },
  {
    id: 'id',
    label: 'Token',
    ellipsis: true,
    getContent({ id: apiToken }) {
      return (
        <div className={locals.apiTokenColContainer}>
          <div>{apiToken}</div>
          <Tooltip align="topRight" content="Copy API token to clipboard">
            <CopyToClipboard getText={() => apiToken}>
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
    deleteEntity: entity => deleteApiToken(entity.id)
  }
};

function getEntityName(entity) {
  return `API token "${entity.name}"`;
}

function onCreateNew() {
  const newId = generateUniqueShortId();
  const newApiToken = Map({
    id: newId,
    name: 'New API Token'
  });

  const saveResult$ = saveApiToken(newApiToken);
  saveResult$.once(() => goToPath(getEntityHref(teamSettingsAccessControlApiTokens, newId)));
  saveResult$.errors().once(error => {
    logger.error(`Failed to save new API token: ${error.message}`, error);
  });
}
