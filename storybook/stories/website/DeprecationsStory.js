import { storiesOf } from '@storybook/react';
import React from 'react';

import DeprecationsPresenter from 'in-websites/WebsiteDashboard/components/Deprecations/DeprecationsPresenter';

import Root from '../_helpers/Root';

storiesOf('Websites/Deprecations', module)
  .add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <DeprecationsPresenter result={{data: ['xrf', 'eh', 'unsupported!']}} />
    </Root>
  );
}
