import { withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import demoCase from './PageLoadView/demoCase.json';

import OverviewChart from 'in-websites/analyze/PageLoadView/tabs/Summary/OverviewChart.js';

import Root from '../_helpers/Root';

storiesOf('Websites/OverviewChart', module)
  .addDecorator(withKnobs)
  .add('default', () => <Default beacons={demoCase} />);

function Default({ beacons }) {
  return (
    <Root>
      <OverviewChart beacons={beacons} />
    </Root>
  );
}
