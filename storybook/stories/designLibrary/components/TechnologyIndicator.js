import { storiesOf } from '@storybook/react';
import React from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import TechnologyIndicator from 'in-applications/components/TechnologyIndicator';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/TechnologyIndicator', module).add('TechnologyIndicator', () => (
  <TechnologyIndicatorStory />
));

function TechnologyIndicatorStory() {
  return (
    <Root>
      <Section title="Indicator List">
        <TechnologyIndicatorList
          technologies={['docker', 'cassandraNode', 'dropwizardApplicationContainer', 'elasticsearchNode', 'mongoDb']}
          responsive={false}
        />
        <TechnologyIndicatorList
          technologies={['docker', 'cassandraNode', 'dropwizardApplicationContainer', 'elasticsearchNode', 'mongoDb']}
        />
      </Section>
      <Section title="Plugin Indicator">
        <TechnologyIndicator pluginOrGroupType="docker" />
        <TechnologyIndicator pluginOrGroupType="cassandraNode" />
        <TechnologyIndicator pluginOrGroupType="dropwizardApplicationContainer" />
        <TechnologyIndicator pluginOrGroupType="elasticsearchNode" />
        <TechnologyIndicator pluginOrGroupType="mongoDb" />
      </Section>
      <Section title="Technology Group Indicator">
        <TechnologyIndicator />
      </Section>
    </Root>
  );
}
