import { storiesOf } from '@storybook/react';
import React from 'react';

import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Components/Kpi Grid Row', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <Section title="Single Row">
        <KpiGridRow sizes={[3, 3, 3, 3]}>
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
        </KpiGridRow>
      </Section>

      <Section title="Multi Row">
        <KpiGridRow sizes={[3, 3, 3, 3]}>
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
        </KpiGridRow>
        <KpiGridRow sizes={[3, 3, 3, 3]}>
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
        </KpiGridRow>
      </Section>
    </Root>
  );
}
