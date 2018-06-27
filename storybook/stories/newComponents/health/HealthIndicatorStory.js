import { storiesOf } from '@storybook/react';
import { range } from 'lodash';
import React from 'react';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
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

      <h1>Health Indicator Button</h1>
      <div>
        <HealthIndicatorButtonPresenter openIssues={0} maxSeverity={0} active /> (active / hover state)
      </div>
      {range(0, 11).map(severity =>
        <div>
          <HealthIndicatorButtonPresenter openIssues={severity} maxSeverity={severity} />
        </div>
      )}
    </Root>
  );
}
