import { storiesOf } from '@storybook/react';
import React from 'react';

import Collapsible from 'in-components/Collapsible';

storiesOf('components/sdk/Collapsible', module)
  .add('simple', () => <Simple />)
  .add('multiple', () => <Multiple />);

function Simple() {
  return (
    <div style={{ width: 400, background: '#ccc' }}>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Header</Collapsible.Header>
        <Collapsible.Content>content</Collapsible.Content>
      </Collapsible>
    </div>
  );
}

function Multiple() {
  return (
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
  );
}
