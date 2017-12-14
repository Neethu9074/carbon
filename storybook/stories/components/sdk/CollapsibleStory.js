import { storiesOf } from '@storybook/react';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import Root from '../../_helpers/Root';

storiesOf('components/sdk/Collapsible', module)
  .add('simple', () => <Simple />)
  .add('multiple', () => <Multiple />);

function Simple() {
  return (
    <Root>
      <div style={{ width: 400, background: '#ccc' }}>
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Header</Collapsible.Header>
          <Collapsible.Content>content</Collapsible.Content>
        </Collapsible>
      </div>
    </Root>
  );
}

function Multiple() {
  return (
    <Root>
      <div style={{ width: 400, background: '#ccc' }}>
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Header</Collapsible.Header>
          <Collapsible.Content>content</Collapsible.Content>
        </Collapsible>
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Header</Collapsible.Header>
          <Collapsible.Content>content</Collapsible.Content>
        </Collapsible>
      </div>
    </Root>
  );
}
