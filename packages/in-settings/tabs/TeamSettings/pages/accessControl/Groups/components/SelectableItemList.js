import React from 'react';

import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import CheckboxFancy from 'in-components/form/CheckboxFancy';

export default function SelectableItemList({ ids, checkIfSelected, toggleItem, List }) {
  return (
    <List
      toggleItem={toggleItem}
      checkIfSelected={checkIfSelected}
      filterFunction={({ id }) => ids.indexOf(id) < 0}
      onClick={item => toggleItem(item.id, item)}
      ListRenderer={ListRenderer}
    />
  );
}

function ListRenderer({ items, checkIfSelected, toggleItem }) {
  return (
    <Ul>
      {items.map(item => (
        <Li key={item.id} onClick={() => toggleItem(item)}>
          <ColumnizedContent
            item={item}
            checkIfSelected={checkIfSelected}
            toggleItem={toggleItem}
            columnDefinitions={columnDefinitions}
          />
        </Li>
      ))}
    </Ul>
  );
}

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ item, checkIfSelected, toggleItem }) {
      const isSelected = checkIfSelected(item.id);
      return <CheckboxFancy checked={isSelected} onChange={() => toggleItem(item)} />;
    }
  },
  {
    getContent({ item }) {
      return item.label;
    }
  }
];
