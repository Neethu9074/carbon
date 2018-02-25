import {withState} from 'recompose';
import { storiesOf } from '@storybook/react';
import React from 'react';

import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';
import DateInput from 'in-components/form/DateInput';
import Root from '../../_helpers/Root';

storiesOf('components/form/DateInput', module).add('default', () => <Default />);

const Default = withState(
  'value',
  'onChange',
  '')(function Default({value, onChange}) {
  return (
    <Root>
      <DateInput value={value} onChange={onChange} />
      <OverlayPresenter />
    </Root>
  );
});
