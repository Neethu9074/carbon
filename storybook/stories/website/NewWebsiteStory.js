import { createField, notBlankValidator } from 'formalistic';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';
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
  let field = createField({
    value: 'shop.example.com',
    validator: notBlankValidator
  });

  if (boolean('With Validation Error?', false)) {
    field = field.setValue('').setTouched(true);
  }

  let saveError;
  if (boolean('With Save Error?', false)) {
    saveError = 'Website name is already used.';
  }

  return (
    <Root>
      <InputStep field={field} loading={boolean('Loading?', false)} saveError={saveError} />
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
