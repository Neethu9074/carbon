import { withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import DropDown from 'in-new-components/DropDown';

import Root from '../_helpers/Root';

const onClick = action('click');

storiesOf('Components/Drop Down', module)
  .addDecorator(withKnobs)
  .add('Drop Down', () => <DropDownStory />);

function DropDownStory() {
  return (
    <Root>
      <div style={{ width: 148 }}>
        <DropDown numItems={4} renderItem={index => 'Item ' + index} onClick={onClick}>
          Drop me down
        </DropDown>
      </div>
    </Root>
  );
}
