import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import theme from 'in-themes';
import React from 'react';

import EditGroupDialogPresenter from 'in-analyze/components/EditGroupDialog/EditGroupDialogPresenter';
import Dialog from 'in-new-components/Dialog';

export default {
  title: 'Organisms|Dialog',
  component: Dialog,
  decorators: [withKnobs]
};

export function Default() {
  return (
    <Dialog title={text('Title', 'Some title')} onClose={action('onClose')}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio dolorem
      cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis consequuntur?
    </Dialog>
  );
}

export function WithCustomCloseBehaviour() {
  return (
    <Dialog
      title={text('Title', 'Some title')}
      renderCustomCloseBehaviour={() => (
        <span style={{ cursor: 'pointer', color: theme.lib.colors.N800Dark }} onClick={action('onCustomClose')}>
          Custom close
        </span>
      )}
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio dolorem
      cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis consequuntur?
    </Dialog>
  );
}

export function WithoutBodyPadding() {
  return (
    <Dialog title={text('Title', 'Some title')} onClose={action('onClose')} withoutBodyPadding>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio dolorem
      cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis consequuntur?
    </Dialog>
  );
}

export function ShowOverflow() {
  const tagSuggestions = ['agent.tag', 'call.latency', 'call.name', 'docker.label', 'call.erroneous'];
  const keySuggestions = [];

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

  return (
    <Dialog title={text('Title', 'Some title')} onClose={action('onClose')} withoutBodyPadding>
      <EditGroupDialogPresenter
        help="Select a tag by which your calls should be grouped."
        form={form}
        tagSuggestions={tagSuggestions}
        onTagChange={action('onTagChange')}
        keySuggestions={keySuggestions}
        onKeyChange={action('onKeyChange')}
        onSubmit={action('onSubmit')}
      />
    </Dialog>
  );
}

export function Headless() {
  return (
    <Dialog headless>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio dolorem
      cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis consequuntur?
    </Dialog>
  );
}
