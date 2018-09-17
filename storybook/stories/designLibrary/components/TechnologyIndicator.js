import { storiesOf } from '@storybook/react';
import React from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import registry from 'in-applications/technologyRegistry';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/Technology Indicator', module).add('TechnologyIndicator', () => (
  <TechnologyIndicatorStory />
));

function TechnologyIndicatorStory() {
  return (
    <Root>
      <Section title="Indicator List">
        <TechnologyIndicatorList technologies={Object.keys(registry)} responsive={false} />
        <TechnologyIndicatorList technologies={Object.keys(registry)} />
      </Section>
    </Root>
  );
}
