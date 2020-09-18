import { action } from '@storybook/addon-actions';
import React from 'react';

import IconButton, { kinds } from 'in-new-components/IconButton/IconButton';

export default {
  title: 'Atoms/Buttons/IconButton',
  component: IconButton
};

const onClick = action('click');

export function Default() {
  return (
    <>
      {kinds.map(kind => (
        <IconButton kind={kind} key={kind} onClick={onClick} type="lib_release_rocket">
          {kind}
        </IconButton>
      ))}
    </>
  );
}

export function CustomIconSize() {
  return (
    <>
      {kinds.map(kind => (
        <IconButton kind={kind} key={kind} iconSize="xl" onClick={onClick} type="lib_release_rocket">
          {kind}
        </IconButton>
      ))}
    </>
  );
}

export function Disabled() {
  return (
    <>
      {kinds.map(kind => (
        <IconButton kind={kind} key={kind} iconSize="l" onClick={onClick} type="lib_release_rocket" disabled>
          {kind}
        </IconButton>
      ))}
    </>
  );
}
