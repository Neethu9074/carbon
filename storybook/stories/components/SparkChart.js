import { storiesOf } from '@storybook/react';
import React from 'react';

import SparkChart from 'in-components/SparkChart';
import Root from '../_helpers/Root';

storiesOf('components/SparkChart', module).add('simple', () => <Simple />);

function Simple() {
  return (
    <Root>
      <SparkChart />
    </Root>
  );
}
