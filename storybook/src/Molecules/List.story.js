import { action } from '@storybook/addon-actions';
import React from 'react';

import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';

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
      <Li renderNestedContent={renderNestedContent}>Item 1</Li>
      <Li renderNestedContent={renderNestedContent}>Item 2</Li>
      <Li renderNestedContent={renderNestedContent}>Item 3</Li>
    </Ul>
  );
};

export const columnizedList = () => {
  const columnDefinitions = [
    {
      width: '4rem',
      getContent() {
        return 'col1';
      }
    },
    {
      getContent({ label }) {
        return 'This is the first column which takes as much space as it is available but can ellipse' + ' ' + label;
      }
    },
    {
      width: '4rem',
      getContent() {
        return 'col2';
      }
    },
    {
      width: '4rem',
      getContent() {
        return 'col3';
      }
    }
  ];
  return (
    <Ul>
      <Li>
        <ColumnizedContent columnDefinitions={columnDefinitions} label="label 1" />
      </Li>
      <Li>
        <ColumnizedContent columnDefinitions={columnDefinitions} label="label 2" />
      </Li>
      <Li>
        <ColumnizedContent columnDefinitions={columnDefinitions} label="label 3" />
      </Li>
    </Ul>
  );
};

function renderNestedContent() {
  return 'Nested Content';
}
