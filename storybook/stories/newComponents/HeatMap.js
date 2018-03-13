import { storiesOf } from '@storybook/react';
import React from 'react';

import HeatMap from 'in-new-components/HeatMap';

import Root from '../_helpers/Root';

storiesOf('newComponents/HeatMap', module).add('Simple HeatMap', () => <SimpleHeatMap />);

function SimpleHeatMap() {
  return (
    <Root>
      <HeatMap />
    </Root>
  );
}
