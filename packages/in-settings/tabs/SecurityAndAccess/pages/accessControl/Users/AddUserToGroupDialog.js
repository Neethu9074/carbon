/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { ColumnizedContent, Ul, Li, Checkbox } from '@instana/components';

import { getGroupsAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import withSelectableItems from 'in-settings/components/withSelectableItems';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import ActionBar from 'in-settings/components/Dialog/ActionBar';
import { close } from 'in-components/DialogPresenter/store';
import ApiList from 'in-settings/components/ApiList';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './AddUserToGroupDialog.mless';

export default withSelectableItems(function AddUserToGroupDialog({
  userId,
  onSubmit,
  selectedEntities,
  checkIfSelected,
  toggleItem
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const disabled = selectedEntities.size === 0;

  return (
    <Dialog className={locals.dialog} title={t('in-settings:tabs.addUserToAGroup')} onClose={close}>
      <ErroneousResultPresenter errors={errors} addBottomMargin />
      <form
        onSubmit={e => {
          stopPropagationAndPreventDefault(e);
          onSubmit(Array.from(selectedEntities.values()), setIsSaving, setErrors);
        }}
      >
        <ApiList
          pageSize={10}
          ListRenderer={ListRenderer}
          getItems={getGroupsAsResultObservable}
          itemName="Group"
          orderBy="name"
          searchFields={['name']}
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
        <ActionBar isSaving={isSaving} disabled={disabled} />
      </form>
    </Dialog>
  );
});

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ group, isGroupSelected, toggleItem }) {
      return <Checkbox checked={isGroupSelected} onChange={() => toggleItem(group.id, group)} />;
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
