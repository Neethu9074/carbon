import { withKnobs, boolean, select } from '@storybook/addon-knobs/react';
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
  const href = boolean('Render as link?', false) ? 'http://example.com' : null;
  const icon = boolean('With icon?', false) ? 'traces' : null;
  const size = select('Size?', sizes, 'normal');

  return (
    <Root>
      <h2>Without Modifiers</h2>
      <p>
        {kinds.map(kind => (
          <Button kind={kind} size={size} key={kind} onClick={onClick} href={href} icon={icon}>
            {kind}
          </Button>
        ))}
      </p>

      <h2>Disabled</h2>
      <p>
        {kinds.map(kind => (
          <Button kind={kind} size={size} disabled key={kind} href={href} icon={icon}>
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
