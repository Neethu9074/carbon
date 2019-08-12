import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Ul, Li } from 'in-new-components/lists/List';

const onClick = action('click');

storiesOf('Content/Lists', module)
  .add('Simple List', () => <SimpleList />)
  .add('List with action', () => <ListWithAction />)
  .add('Clickable List', () => <ClickableList />);

function SimpleList() {
  return (
    <Ul>
      <Li>Item 1</Li>
      <Li>Item 2</Li>
      <Li>Item 3</Li>
    </Ul>
  );
}

function ListWithAction() {
  return (
    <Ul>
      <Li renderActions={'Action'}>Item 1</Li>
      <Li renderActions={'Action'}>Item 2</Li>
      <Li renderActions={'Action'}>Item 3</Li>
    </Ul>
  );
}

function ClickableList() {
  return (
    <Ul>
      <Li onClick={onClick}>Item 1</Li>
      <Li onClick={onClick}>Item 2</Li>
      <Li onClick={onClick}>Item 3</Li>
    </Ul>
  );
}
