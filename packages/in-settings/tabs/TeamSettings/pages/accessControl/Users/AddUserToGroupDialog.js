import React, { useState } from 'react';

import { getGroupsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/groups';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { close } from 'in-components/DialogPresenter/store';
import createApiList from 'in-settings/components/ApiList';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';

import locals from './AddUserToGroupDialog.mless';

const GroupList = createApiList({
  ListRenderer,
  getItems: getGroupsAsResultObservable,
  itemName: 'group',
  orderBy: 'name'
});

export default function AddUserToGroupDialog({ userId, isSaving, onSubmit }) {
  const [selectedGroups, setSelectedGroups] = useState(new Map());

  return (
    <Dialog className={locals.dialog} title="Add user to a group" onClose={close}>
      <form onSubmit={() => onSubmit(Array.from(selectedGroups.values()))}>
        <GroupList
          userId={userId}
          selectedGroups={selectedGroups}
          setSelectedGroups={setSelectedGroups}
          filterFunction={({ members }) => {
            for (let i = 0; i < members.length; i++) {
              if (userId === members[i].userId) {
                return false;
              }
            }
            return true;
          }}
        />
        <Button
          className={locals.button}
          kind="primary"
          type="submit"
          disabled={isSaving || selectedGroups.size === 0}
          icon={isSaving ? 'lib_actions_loading' : undefined}
          iconSpinning={isSaving}
        >
          Add user to group
        </Button>
      </form>
    </Dialog>
  );
}
const columnDefinitions = [
  {
    width: '2rem',
    getContent({ isSelected, toggle }) {
      return <CheckboxFancy checked={isSelected} onChange={toggle} />;
    }
  },
  {
    getContent({ group }) {
      return group.name;
    }
  }
];

function ListRenderer({ items, selectedGroups, setSelectedGroups }) {
  return (
    <Ul>
      {items.map(group => {
        const isSelected = selectedGroups.has(group.id);
        const toggle = () => {
          const copy = new Map(selectedGroups);
          if (isSelected) {
            copy.delete(group.id);
          } else {
            copy.set(group.id, group);
          }
          setSelectedGroups(copy);
        };

        return (
          <Li key={group.id} onClick={() => toggle()}>
            <ColumnizedContent
              columnDefinitions={columnDefinitions}
              group={group}
              toggle={toggle}
              isSelected={isSelected}
            />
          </Li>
        );
      })}
    </Ul>
  );
}
