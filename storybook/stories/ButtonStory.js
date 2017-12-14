import { withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { kinds, sizes } from 'in-components/Button';
import ButtonGroup from 'in-components/ButtonGroup';
import Button from 'in-components/Button';

const onClick = action('click');

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('Kinds', () => <Kinds />)
  .add('Sizes', () => <Sizes />)
  .add('Groups', () => <Groups />);


function Kinds() {
  let href;

  if (boolean('Render as link?', false)) {
    href = 'http://example.com';
  }

  return (
    <div>

      <h2>Without Modifiers</h2>
      <p>
        {kinds.map(kind =>
          <Button kind={kind}
                  key={kind}
                  onClick={onClick}
                  href={href}>
            {kind}
          </Button>
        )}
      </p>

      <h2>Disabled</h2>
      <p>
        {kinds.map(kind =>
          <Button kind={kind} disabled key={kind} href={href}>
            {kind}
          </Button>
        )}
      </p>

      <h2>Outline Only</h2>
      <p>
        {kinds.map(kind =>
          <Button kind={kind}
                  key={kind}
                  onClick={onClick}
                  href={href}
                  outlineOnly>
            {kind}
          </Button>
        )}
      </p>

      <h2>Disabled and Outline Only</h2>
      <p>
        {kinds.map(kind =>
          <Button kind={kind}
                  key={kind}
                  onClick={onClick}
                  href={href}
                  outlineOnly
                  disabled>
            {kind}
          </Button>
        )}
      </p>
    </div>
  );
}


function Sizes() {
  return (
    <div>
      {sizes.map(size =>
        <Button size={size} onClick={onClick} key={size}>
          {size}
        </Button>
      )}
    </div>
  );
}


function Groups() {
  return (
    <div>
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
  );
}
