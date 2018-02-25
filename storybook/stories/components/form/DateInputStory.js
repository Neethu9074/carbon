import { storiesOf } from '@storybook/react';
import React from 'react';

import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';
import DateInput from 'in-components/form/DateInput';
import Root from '../../_helpers/Root';

storiesOf('components/form/DateInput', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <DateInput />
      <OverlayPresenter />
    </Root>
  );
}
