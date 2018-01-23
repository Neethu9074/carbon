import { storiesOf } from '@storybook/react';
import React from 'react';

import Table from 'in-applications/Table';

storiesOf('content/ApplicationTable', module).add('Simple', () => <Simple />);

function Simple() {
  return <Table onStateChanged={state => console.log(state)} items={[{ label: 'row label' }]} />;
}
