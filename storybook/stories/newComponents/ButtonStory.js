import { withKnobs, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { kinds, sizes } from 'in-new-components/Button';
import Button from 'in-new-components/Button';
import Root from '../_helpers/Root';

const onClick = action('click');

storiesOf('newComponents/Button', module)
  .addDecorator(withKnobs)
  .add('Kinds', () => <Kinds />)
  .add('Sizes', () => <Sizes />);

function Kinds() {
  let href;

  if (boolean('Render as link?', false)) {
    href = 'http://example.com';
  }

  return (
    <Root>
      <h2>Without Modifiers</h2>
      <p>
        {kinds.map(kind => (
          <Button kind={kind} key={kind} onClick={onClick} href={href}>
            {kind}
          </Button>
        ))}
      </p>

      <h2>Disabled</h2>
      <p>
        {kinds.map(kind => (
          <Button kind={kind} disabled key={kind} href={href}>
            {kind}
          </Button>
        ))}
      </p>
    </Root>
  );
}

function Sizes() {
  return (
    <Root>
      {sizes.map(size => (
        <Button size={size} onClick={onClick} key={size}>
          {size}
        </Button>
      ))}
    </Root>
  );
}
