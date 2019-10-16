import { storiesOf } from '@storybook/react';
import React from 'react';

import Capitalize from 'in-new-components/Capitalize';

import Root from '../_helpers/Root';

storiesOf('Components/Capitalize', module).add('CapitalizeStory', () => <CapitalizeStory />);

function CapitalizeStory() {
  return (
    <Root>
      <Capitalize>foobar</Capitalize>
    </Root>
  );
}
