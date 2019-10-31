import { withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import ButtonRounded from 'in-new-components/ButtonRounded/ButtonRounded';
import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

const onClick = action('click');

storiesOf('Components/ButtonRounded', module)
  .addDecorator(withKnobs)
  .add('ButtonRounded', () => <ButtonRoundedStory />);

function ButtonRoundedStory() {
  return (
    <Root>
      <Section title="Standard">
        <p>
          <ButtonRounded onClick={onClick}>Button Rounded</ButtonRounded>
        </p>
      </Section>

      <Section title="With Icon">
        <p>
          <ButtonRounded iconType="lib_alerts_create" onClick={onClick}>
            Button Rounded with icon
          </ButtonRounded>
        </p>
      </Section>

      <Section title="With Icon and box-shadow">
        <p>
          <ButtonRounded iconType="lib_alerts_create" onClick={onClick} withBoxShadow>
            Button Rounded with icon
          </ButtonRounded>
        </p>
      </Section>
    </Root>
  );
}
