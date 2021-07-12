/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, ColumnizedContent, Li, Ul } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { createLogger } from '@instana/logger';

import {
  deletePersonalApiToken,
  createPersonalApiToken,
  getPersonalApiTokensOfUserAsResultObservable
} from 'in-settings/tabs/UserSettings/api/personalApiToken';
import { getEntityHref, getEntityIdView, userSettingsPersonalApiTokens } from 'in-settings/navigation/paths';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import IconButton from 'in-components/IconButton/IconButton';
import CopyToClipboard from 'in-components/CopyToClipboard';
import ApiList from 'in-settings/components/ApiList';
import { goToPath } from 'in-stores/navigation';
import { user } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

const logger = createLogger('PersonalApiTokens');

export default function PersonalApiTokens() {
  return (
    <ApiList
      ListRenderer={ListRenderer}
      getItems={() => getPersonalApiTokensOfUserAsResultObservable(user.id)}
      deleteItem={deletePersonalApiToken}
      itemName="PersonalAPIToken"
      searchFields={['name', 'accessGrantingToken']}
      orderBy="name"
      boundedPath={'/personal-api-tokens'}
      renderAdditionalHeaderContent={renderAdditionalHeaderContent}
    />
  );
}

function ListRenderer({ items, deleteItem, currentDeletingItemIds }) {
  return (
    <Ul>
      {items.map(personalApiToken => (
        <Li
          key={personalApiToken.tokenId}
          href$={getEntityIdView(userSettingsPersonalApiTokens, personalApiToken.tokenId)}
        >
          <ColumnizedContent
            columnDefinitions={columnDefinitions}
            personalApiToken={personalApiToken}
            deleteItem={() => deleteItem(personalApiToken.tokenId)}
            currentDeletingItemIds={currentDeletingItemIds}
          />
        </Li>
      ))}
    </Ul>
  );
}

const columnDefinitions = [
  {
    width: '20rem',
    getContent({ personalApiToken }) {
      return personalApiToken.name;
    }
  },
  {
    width: '20rem',
    getContent({ personalApiToken }) {
      return (
        <>
          <span>{personalApiToken.accessGrantingToken.substring(0, 4) + '********************'}</span>
          <CopyToClipboard getText={() => personalApiToken.accessGrantingToken}>
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
        </>
      );
    }
  },
  {
    width: '2rem',
    getContent({ personalApiToken, deleteItem, currentDeletingItemIds }) {
      return (
        <Delete
          itemName={personalApiToken.name}
          doDelete={deleteItem}
          isDeleting={currentDeletingItemIds.has(personalApiToken.tokenId)}
          dialogMessage={() => {
            return (
              <span>
                <Trans
                  i18nKey="in-settings:components.confirmRemoveEntity"
                  values={{ entity: personalApiToken.name }}
                />
              </span>
            );
          }}
        />
      );
    }
  }
];

function renderAdditionalHeaderContent() {
  const onAdd = () => {
    const accessGrantingToken = generateUniqueShortId();
    const saveResult$ = createPersonalApiToken({
      accessGrantingToken,
      tokenId: generateUniqueShortId(),
      userId: user.id,
      name: t('in-settings:tabs.newPersonalApiToken')
    });
    // Note: The backend will overwrite the end-user provided IDs during creation.
    saveResult$.once(savedApiToken => goToPath(getEntityHref(userSettingsPersonalApiTokens, savedApiToken.tokenId)));
    saveResult$.errors().once(error => {
      logger.error(`Failed to save new personal API token: ${error.message}`, error);
    });
  };

  return (
    <Button kind="action" onClick={onAdd} icon="lib_openclose_add_circle_outline">
      {t('in-settings:tabs.newPersonalApiToken')}
    </Button>
  );
}
