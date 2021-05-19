/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';
import { Button } from '@instana/components';

import { getGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
import withSelectableItems from 'in-settings/components/withSelectableItems';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import ApiList from 'in-settings/components/ApiList';
import { t } from 'in-i18n';

import locals from './AddUserToGroupDialog.mless';

export default withSelectableItems(function AddUserToGroupDialog({
  userId,
  onSubmit,
  selectedEntities,
  checkIfSelected,
  toggleItem
}) {
  return (
    <Dialog className={locals.dialog} title={t('in-settings:tabs.addUserToAGroup')} onClose={close}>
      <form
        onSubmit={e => {
          stopPropagationAndPreventDefault(e);
          onSubmit(Array.from(selectedEntities.values()));
        }}
      >
        <ApiList
          ListRenderer={ListRenderer}
          getItems={getGroupsAsResultObservable}
          itemName="group"
          orderBy="name"
          userId={userId}
          checkIfSelected={checkIfSelected}
          toggleItem={toggleItem}
          filterFunction={({ members }) => {
            for (let i = 0; i < members.length; i++) {
              if (userId === members[i].userId) {
                return false;
              }
            }
            return true;
          }}
        />
        <Button className={locals.button} kind="primary" type="submit" disabled={selectedEntities.size === 0}>
          {t('in-settings:tabs.addUserToGroup')}
        </Button>
      </form>
    </Dialog>
  );
});

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ group, isGroupSelected, toggleItem }) {
      return <CheckboxFancy checked={isGroupSelected} onChange={() => toggleItem(group.id, group)} />;
    }
  },
  {
    getContent({ group }) {
      return group.name;
    }
  }
];

function ListRenderer({ items, checkIfSelected, toggleItem }) {
  return (
    <Ul>
      {items.map(group => {
        const isGroupSelected = checkIfSelected(group.id);
        return (
          <Li key={group.id} onClick={() => toggleItem(group.id, group)}>
            <ColumnizedContent
              columnDefinitions={columnDefinitions}
              group={group}
              toggleItem={() => toggleItem(group.id, group)}
              isGroupSelected={isGroupSelected}
            />
          </Li>
        );
      })}
    </Ul>
  );
}
