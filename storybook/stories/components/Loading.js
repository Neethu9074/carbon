import { withKnobs, number } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Components/Loading', module)
  .addDecorator(withKnobs)
  .add('Loading', () => <LoadingStory />);

function LoadingStory() {
  return (
    <Root>
      <Section title="Infinite Bar">
        <HorizontalIndicator
          progress={{
            loading: true
          }}
        />
      </Section>
      <Section title="Progress Bar">
        <HorizontalIndicator
          progress={{
            loading: true,
            percentage: number('Percentage', 0.5, {
              range: true,
              min: 0,
              max: 1,
              step: 0.01
            })
          }}
        />
      </Section>

      <Section title="Infinite Circle default">
        <InfiniteCircle width={400} height={100} />
      </Section>

      <Section title="Infinite Circle small">
        <InfiniteCircle width={72} height={24} />
      </Section>
    </Root>
  );
}
