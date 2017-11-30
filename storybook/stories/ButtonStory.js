import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { kinds, sizes } from 'in-components/Button';
import ButtonGroup from 'in-components/ButtonGroup';
import Button from 'in-components/Button';

storiesOf('Button', module)
  .add('Kinds', () => <Kinds />)
  .add('Sizes', () => <Sizes />)
  .add('Groups', () => <Groups />);


function Kinds() {
  return (
    <div>
      <p>
        {kinds.map(kind =>
          <Button kind={kind}
          key={kind}
                  onClick={action('click')}>
            {kind}
          </Button>
        )}
      </p>

      <p>
        {kinds.map(kind =>
          <Button kind={kind} disabled key={kind}>
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
        <Button size={size} onClick={action('click')} key={size}>
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
