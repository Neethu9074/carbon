import { withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import InputStep from 'in-websites/NewWebsiteFlow/InputStep';
import ReadyStep from 'in-websites/NewWebsiteFlow/ReadyStep';
import WaitStep from 'in-websites/NewWebsiteFlow/WaitStep';

import Root from '../_helpers/Root';

storiesOf('Websites/New Website', module)
  .addDecorator(withKnobs)
  .add('Input Step', () => <InputStepStory />)
  .add('Wait Step', () => <WaitStepStory />)
  .add('Ready Step', () => <ReadyStepStory />);

function InputStepStory() {
  return (
    <Root>
      <InputStep />
    </Root>
  );
}

function WaitStepStory() {
  return (
    <Root>
      <WaitStep websiteId="89jkdsa1khj32njk1" websiteName="shop.example.com" />
    </Root>
  );
}


function ReadyStepStory() {
  return (
    <Root>
      <ReadyStep websiteId="89jkdsa1khj32njk1" websiteName="shop.example.com" />
    </Root>
  );
}
