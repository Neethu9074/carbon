import { action } from '@storybook/addon-actions';
import React from 'react';

import { Ul, Li } from 'in-new-components/lists/List';

const onClick = action('click');

export default {
  title: 'Molecules|Lists',
  decorator: { action }
};

export const SimpleList = () => {
  return (
    <Ul>
      <Li>Item 1</Li>
      <Li>Item 2</Li>
      <Li>Item 3</Li>
    </Ul>
  );
};

export const ListWithAction = () => {
  return (
    <Ul>
      <Li renderActions={renderActions}>Item 1</Li>
      <Li renderActions={renderActions}>Item 2</Li>
      <Li renderActions={renderActions}>Item 3</Li>
    </Ul>
  );
};

export const ClickableList = () => {
  return (
    <Ul>
      <Li onClick={onClick}>Item 1</Li>
      <Li onClick={onClick}>Item 2</Li>
      <Li onClick={onClick}>Item 3</Li>
    </Ul>
  );
};

export const CollapsibleList = () => {
  return (
    <Ul>
      <Li renderActions={renderActions} renderNestedContent={renderNestedContent}>
        Item 1
      </Li>
      <Li renderNestedContent={renderNestedContent}>Item 2</Li>
      <Li renderNestedContent={renderNestedContent}>Item 3</Li>
    </Ul>
  );
};

function renderActions() {
  return 'Action';
}

function renderNestedContent() {
  return 'Nested Content';
}
