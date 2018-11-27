import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { withKnobs, boolean, text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import EditGroupDialogPresenter from 'in-analyze/components/EditGroupDialog/EditGroupDialogPresenter';
import DialogRoot from '../_helpers/DialogRoot';

storiesOf('Analyse/EditGroupDialog', module)
  .addDecorator(withKnobs)
  .add('Default', () => <Default />);

function Default() {
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
    .setTouched(boolean('Form Touched?', false), { recurse: true });

  const tagSuggestions = ['agent.tag', 'call.latency', 'call.name', 'docker.label', 'call.erroneous'];
  const keySuggestions = [];

  return (
    <DialogRoot>
      <EditGroupDialogPresenter
        help="Select a tag by which your calls should be grouped."
        form={form}
        tagSuggestions={tagSuggestions}
        onTagChange={action('onTagChange')}
        keySuggestions={keySuggestions}
        onKeyChange={action('onKeyChange')}
        onSubmit={action('onSubmit')}
      />
    </DialogRoot>
  );
}
