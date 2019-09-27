import { withKnobs, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import Root from '../_helpers/Root';

storiesOf('Analyse/TagFilterList', module)
  .addDecorator(withKnobs)
  .add('Default', () => <Default />);

function Default() {
  const tagFilters = [];

  if (boolean('With Boolean Filter?', true)) {
    tagFilters.push({
      name: 'trace.erroneous',
      operator: 'EQUALS',
      booleanValue: true
    });
    tagFilters.push({
      name: 'call.is_synthetic',
      operator: 'EQUALS',
      booleanValue: false
    });
  }

  if (boolean('With Number Filters?', true)) {
    tagFilters.push({
      name: 'trace.latency',
      operator: 'EQUALS',
      numberValue: 42
    });
    tagFilters.push({
      name: 'trace.latency',
      operator: 'NOT_EQUAL',
      numberValue: 41
    });
    tagFilters.push({
      name: 'trace.latency',
      operator: 'GREATER_THAN',
      numberValue: 41
    });
    tagFilters.push({
      name: 'trace.latency',
      operator: 'LESS_THAN',
      numberValue: 43
    });
  }

  if (boolean('With String Filters?', true)) {
    tagFilters.push({
      name: 'application.name',
      operator: 'EQUALS',
      stringValue: 'Shop Shop'
    });
    tagFilters.push({
      name: 'service.name',
      operator: 'CONTAINS',
      stringValue: 'shop'
    });
  }

  if (boolean('With Key/Value Filters?', true)) {
    tagFilters.push({
      name: 'docker.label',
      operator: 'EQUALS',
      stringValue: 'environment=production'
    });
    tagFilters.push({
      name: 'docker.label',
      operator: 'NOT_EMPTY',
      stringValue: 'beta'
    });
  }

  return (
    <Root>
      <TagFilterListPresenter
        tagFilters={tagFilters}
        onTagFilterClick={action('onTagFilterClick')}
        onRemoveTagFilter={action('onRemoveTagFilter')}
      />
    </Root>
  );
}
