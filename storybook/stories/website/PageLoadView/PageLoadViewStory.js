import { storiesOf } from '@storybook/react';
import React from 'react';

import Summary from 'in-websites/analyze/PageLoadView/tabs/Summary/Summary';
import clockSkewProblems from './clockSkewProblems.json';
import demoCase from './demoCase.json';
import Root from '../../_helpers/Root';

storiesOf('Websites/PageLoadView', module)
  .add('demo case', () => <PageLoadViewStory beacons={demoCase} />)
  .add('clock skew problems', () => <PageLoadViewStory beacons={clockSkewProblems} />);

function PageLoadViewStory({ beacons }) {
  return (
    <Root>
      <Summary beacons={beacons} />
    </Root>
  );
}
