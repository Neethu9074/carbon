/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, ColumnizedContent, Li, Ul } from '@instana/components';

import {
  deletePersonalApiToken,
  getPersonalApiTokensOfUserAsResultObservable
} from 'in-settings/tabs/UserSettings/api/personalApiToken';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import CreatePersonalApiToken from './CreatePersonalApiToken';
import IconButton from 'in-components/IconButton/IconButton';
import CopyToClipboard from 'in-components/CopyToClipboard';
import EditPersonalApiToken from './EditPersonalApiToken';
import ApiList from 'in-settings/components/ApiList';
import { user } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

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
          onClick={() => addActiveDialog(<EditPersonalApiToken onClose={close} current={personalApiToken} />)}
          /*href$={getEntityIdView(userSettingsPersonalApiTokens, personalApiToken.tokenId)}*/
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
          dialogMessage={
            <Trans i18nKey="in-settings:components.confirmRemoveEntity" values={{ entity: personalApiToken.name }} />
          }
        />
      );
    }
  }
];

function renderAdditionalHeaderContent() {
  return (
    <Button
      kind="action"
      onClick={() => addActiveDialog(<CreatePersonalApiToken onClose={close} />)}
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-settings:tabs.newPersonalApiToken')}
    </Button>
  );
}
