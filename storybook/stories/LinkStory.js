import { storiesOf } from '@storybook/react';
import React from 'react';

import Link from 'in-components/Link';

storiesOf('Link', module).add('Common', () => <Simple />);

function Simple() {
  return (
    <div style={{ padding: '1rem' }}>
      <Link href="https://www.google.de">a simple link</Link>
      <br />
      <Link href="https://www.google.de" external>
        an external link
      </Link>
    </div>
  );
}
