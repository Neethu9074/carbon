import { storiesOf } from '@storybook/react';
import React from 'react';

import { deepFreeze } from 'in-services/util/object';
import TimingChart from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/TimingChart';

import Root from '../_helpers/Root';

storiesOf('analyse/TimingChart', module)
  .add('Timing Chart', () => <TimingChartStory />);

function TimingChartStory() {
  const call = deepFreeze({
    id: '1',
    label: 'GET /api/hello',
    start: 100,
    duration: 20,
    networkTime: 6
  });

  const callTreeNode = deepFreeze({
    id: '1',
    label: 'GET /api/hello',
    start: 100,
    duration: 20,
    networkTime: 6,
    children: [
      {
        id: '2',
        label: 'database call',
        start: 90,
        duration: 1,
        networkTime: null,
        children:[]
      },
      {
        id: '3',
        label: 'database call',
        start: 105,
        duration: 2,
        networkTime: null,
        children:[]
      },
      {
        id: '4',
        label: 'async call',
        start: 108,
        duration: 5,
        networkTime: null,
        children:[]
      },
      {
        id: '5',
        label: 'database call',
        start: 109,
        duration: 1,
        networkTime: null,
        children:[]
      },
      {
        id: '6',
        label: 'database call',
        start: 112,
        duration: 3,
        networkTime: null,
        children:[]
      },
      {
        id: '7',
        label: 'database call',
        start: 130,
        duration: 1,
        networkTime: null,
        children:[]
      }
    ]
  });

  return (
    <Root>
      <TimingChart call={call} callTreeNode={callTreeNode} />
    </Root>
  );
}
