import { storiesOf } from '@storybook/react';
import React from 'react';

import ReleaseStatusRowPresenter from 'in-events/releases/ReleaseStatusRowPresenter';
import Root from '../_helpers/Root';

storiesOf('Releases/Release Status Row', module).add('sortDirection ASC', () => <MarkerRowAsc />);
storiesOf('Releases/Release Status Row', module).add('sortDirection DESC', () => <MarkerRowDsc />);

function MarkerRowAsc() {
  return (
    <Root>
      <ReleaseStatusRowPresenter rawEvent={getRawEvent()} healthStatus={getHealthData()} sortDirection="asc" />
    </Root>
  );
}

function MarkerRowDsc() {
  return (
    <Root>
      <ReleaseStatusRowPresenter rawEvent={getRawEvent()} healthStatus={getHealthData()} sortDirection="desc" />
    </Root>
  );
}

function startDate(minutes) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutes);
  return d;
}

function getRawEvent() {
  return {
    id: 'ABC4567',
    title: 'v147-eu-prod',
    start: startDate(10)
  };
}

function getHealthData() {
  return {
    before: {
      incidents: 2,
      health: 0.9998123123123123123,
      start: startDate(20),
      end: startDate(10)
    },
    after: {
      incidents: 7,
      health: 0.9954843026473247835,
      start: startDate(20),
      end: startDate(10)
    }
  };
}
