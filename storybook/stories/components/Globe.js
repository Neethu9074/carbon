import { storiesOf } from '@storybook/react';
import React from 'react';

import GlobeView from 'in-new-components/GlobeView';

import Root from '../_helpers/Root';

storiesOf('Components/Globe', module).add('Globe', () => <GlobeStory />);

function GlobeStory() {
  return (
    <Root>
      <GlobeView />
    </Root>
  );
}
