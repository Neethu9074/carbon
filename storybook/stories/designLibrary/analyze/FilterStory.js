import { storiesOf } from '@storybook/react';
import React from 'react';

import FilterPlaceholder from 'in-analyze/Filter/FilterPlaceholder';
import FilterPreview from 'in-analyze/Filter/FilterPreview';
import StaticFilter from 'in-analyze/Filter/StaticFilter';
import FilterGroup from 'in-analyze/Filter/FilterGroup';
import Filter from 'in-analyze/Filter';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Analyze/FilterStory', module).add('Filter', () => <FilterStory />);

function FilterStory() {
  return (
    <Root>
      <Section title="Preview">
        <FilterGroup>
          <FilterPreview title="Source" isStatic items={[{ label: 'Calls' }]} />
          <FilterPreview title="Filter" items={[{ label: 'Filter A' }, { label: 'Filter B' }, { label: 'Filter B' }]} />
          <FilterPreview title="Group" items={[{ label: 'Trace Name', color: '#39BF7C' }]} />
        </FilterGroup>
      </Section>

      <Section title="Sizes">
        <FilterGroup>
          <Filter size="compact">Compact</Filter>
          <Filter size="compact" icon="lib_actions_star">
            Compact with icon
          </Filter>
          <Filter title="Size">Default</Filter>
          <Filter title="Size" icon="lib_actions_star">
            Default with icon
          </Filter>
        </FilterGroup>
      </Section>

      <Section title="Static">
        <FilterGroup>
          <StaticFilter size="compact">You cannot change me</StaticFilter>
          <StaticFilter size="compact">One does not simply change a static filter</StaticFilter>
        </FilterGroup>
      </Section>

      <Section title="Placeholder">
        <FilterGroup>
          <FilterPlaceholder>Application</FilterPlaceholder>
          <FilterPlaceholder>Filter</FilterPlaceholder>
        </FilterGroup>
      </Section>

      <Section title="Filter">
        <FilterGroup>
          <Filter title="Application Name" icon="lib_application">
            My awesome application
          </Filter>
          <Filter title="docker.label">some docker label</Filter>
        </FilterGroup>
      </Section>

      <Section title="Filter Group">
        <FilterGroup name="Source">
          <StaticFilter size="compact">Calls</StaticFilter>
        </FilterGroup>
        <FilterGroup name="Group 2">
          <Filter title="Application Name" icon="lib_application">
            My awesome application
          </Filter>
          <Filter title="docker.label">some docker label</Filter>
          <FilterPlaceholder>Filter</FilterPlaceholder>
        </FilterGroup>
      </Section>
    </Root>
  );
}
