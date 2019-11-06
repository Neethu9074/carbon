import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import IconButton, { kinds } from 'in-new-components/IconButton/IconButton';

const onClick = action('click');

storiesOf('Components/IconButton', module)
  .addParameters({ component: IconButton })
  .add('Default size', () => (
    <p>
      {kinds.map(kind => (
        <IconButton kind={kind} key={kind} onClick={onClick} type="lib_release_rocket">
          {kind}
        </IconButton>
      ))}
    </p>
  ))
  .add('Custom icon size', () => (
    <p>
      {kinds.map(kind => (
        <IconButton kind={kind} key={kind} iconSize="xl" onClick={onClick} type="lib_release_rocket">
          {kind}
        </IconButton>
      ))}
    </p>
  ))
  .add('Disabled', () => (
    <p>
      {kinds.map(kind => (
        <IconButton kind={kind} key={kind} iconSize="l" onClick={onClick} type="lib_release_rocket" disabled>
          {kind}
        </IconButton>
      ))}
    </p>
  ));
