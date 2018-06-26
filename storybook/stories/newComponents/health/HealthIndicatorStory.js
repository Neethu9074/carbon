import { storiesOf } from '@storybook/react';
import React, { Fragment } from 'react';
import { range } from 'lodash';

import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import Root from '../../_helpers/Root';

storiesOf('newComponents/health/HealthIndicator', module)
  .add('default', () => <Default />);

function Default() {
  return (
    <Root>
      {range(0, 11).map(severity =>
        <p>
          <HealthIndicatorPresenter openIssues={severity} maxSeverity={severity} />
        </p>
      )}
    </Root>
  );
}

