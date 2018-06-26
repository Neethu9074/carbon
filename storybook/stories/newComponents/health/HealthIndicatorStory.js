import { storiesOf } from '@storybook/react';
import { range } from 'lodash';
import React from 'react';

import HealthIndicatorBadgePresenter from 'in-new-components/health/HealthIndicatorBadgePresenter';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import Root from '../../_helpers/Root';

storiesOf('newComponents/health/HealthIndicator', module)
  .add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <h1>Health Indicator</h1>
      <div>
        <HealthIndicatorPresenter openIssues={0} maxSeverity={0} active /> (active / hover state)
      </div>
      {range(0, 11).map(severity =>
        <div>
          <HealthIndicatorPresenter openIssues={severity} maxSeverity={severity} />
        </div>
      )}

      <h1>Health Indicator Badge</h1>
      <div>
        <HealthIndicatorBadgePresenter openIssues={0} maxSeverity={0} active /> (active / hover state)
      </div>
      {range(0, 11).map(severity =>
        <div>
          <HealthIndicatorBadgePresenter openIssues={severity} maxSeverity={severity} />
        </div>
      )}
    </Root>
  );
}

