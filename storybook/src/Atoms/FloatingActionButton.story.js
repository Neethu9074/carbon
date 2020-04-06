import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import React from 'react';

import FloatingActionButton from 'in-new-components/FloatingActionButton/FloatingActionButton';
import markdownNotes from './FloatingActionButton.md';

export default {
  title: 'Atoms|Buttons/Floating Action Button',
  component: FloatingActionButton,
  decorators: [withKnobs],
  parameters: { notes: markdownNotes }
};

const onClick = action('click');

export const Standard = () => {
  return <FloatingActionButton onClick={onClick}>Button Rounded</FloatingActionButton>;
};

export const WithIcon = () => (
  <FloatingActionButton iconType="lib_alerts_create" onClick={onClick}>
    Button Rounded with icon
  </FloatingActionButton>
);
