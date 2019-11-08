import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import FloatingActionButton from 'in-new-components/FloatingActionButton/FloatingActionButton';

const onClick = action('click');

storiesOf('Components/FloatingActionButton', module)
  .addParameters({ component: FloatingActionButton })
  .add('Standard', () => <FloatingActionButton onClick={onClick}>Button Rounded</FloatingActionButton>)
  .add('With Icon', () => (
    <FloatingActionButton iconType="lib_alerts_create" onClick={onClick}>
      Button Rounded with icon
    </FloatingActionButton>
  ))
  .add('With icon and shadow', () => (
    <FloatingActionButton iconType="lib_alerts_create" onClick={onClick} withBoxShadow>
      Button Rounded with icon
    </FloatingActionButton>
  ));
