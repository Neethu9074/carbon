import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import React from 'react';

import EditTagFilterDialogPresenter from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialogPresenter';

export default {
  title: 'Templates/analyze/EditTagFilterDialogPresenter',
  component: EditTagFilterDialogPresenter,
  decorators: [withKnobs]
};

export function Default() {
  const form = createMapForm()
    .put(
      'tag',
      createField({
        value: 'docker.label',
        validator: notBlankValidator
      })
    )
    .put(
      'key',
      createField({
        value: text('key', 'environment'),
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: text('value', 'production'),
        validator: notBlankValidator
      })
    )
    .put(
      'operator',
      createField({
        value: text('operator', 'EQUALS'),
        validator: notBlankValidator
      })
    )
    .setTouched(boolean('Form Touched?', false), { recurse: true });

  const tagSuggestions = ['agent.tag', 'call.latency', 'call.name', 'docker.label', 'call.erroneous'];
  const selectedTagType = 'KEY_VALUE_PAIR';

  const operatorSuggestions = ['EQUALS', 'NOT_EQUAL'];
  const valueSuggestions = [];
  const keySuggestions = [];

  return (
    <EditTagFilterDialogPresenter
      editMode={boolean('Edit Mode?', true)}
      onRemoveTagFilter={action('onRemoveTagFilter')}
      form={form}
      tagSuggestions={tagSuggestions}
      selectedTagType={selectedTagType}
      onTagChange={action('onTagChange')}
      operatorSuggestions={operatorSuggestions}
      onOperatorChange={action('onOperatorChange')}
      keySuggestions={keySuggestions}
      onKeyChange={action('onKeyChange')}
      valueSuggestions={valueSuggestions}
      onValueChange={action('onValueChange')}
      onSubmit={action('onSubmit')}
    />
  );
}
