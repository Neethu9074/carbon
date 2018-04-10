import { storiesOf } from '@storybook/react';
import React from 'react';

import TimingChart from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/TimingChart';

import Root from '../_helpers/Root';

storiesOf('analyse/TimingChart', module)
  .add('Timing Chart', () => <TimingChartStory />);

function TimingChartStory() {
  const call = {
    id: '1',
    label: 'GET /api/hello',
    start: 100,
    duration: 20,
    networkTime: 8
  };

  const callTreeNode = {
    id: '1',
    label: 'GET /api/hello',
    start: 100,
    duration: 20,
    networkTime: 6,
    children: [
      {
        id: '3',
        label: 'database call',
        start: 105,
        duration: 2,
        networkTime: null,
        children:[]
      },
      {
        id: '2',
        label: 'database call',
        start: 108,
        duration: 5,
        networkTime: null,
        children:[]
      }
    ]
  };

  return (
    <Root>
      <TimingChart call={call} callTreeNode={callTreeNode} />
    </Root>
  );
}
