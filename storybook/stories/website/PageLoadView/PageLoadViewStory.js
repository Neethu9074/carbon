import { storiesOf } from '@storybook/react';
import React from 'react';

import Summary from 'in-websites/analyze/PageLoadView/tabs/Summary/Summary';
import demoCase from './demoCase.json';
import Root from '../../_helpers/Root';

storiesOf('Websites/PageLoadView', module)
  .add('demo case', () => <PageLoadViewStory beacons={demoCase} />);

function PageLoadViewStory({beacons}) {
  return (
    <Root>
      <Summary beacons={beacons} />
    </Root>
  );
}
