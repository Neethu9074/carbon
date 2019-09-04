import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import EditGroupDialogPresenter from 'in-analyze/components/EditGroupDialog/EditGroupDialogPresenter';
import DialogRoot from '../_helpers/DialogRoot';
import Dialog from 'in-new-components/Dialog';

import theme from 'in-themes';

storiesOf('Components/Dialog', module)
  .addDecorator(withKnobs)
  .add('default', () => <Default />)
  .add('without body padding', () => <WithoutBodyPadding />)
  .add('show overflow', () => <ShowOverflow />)
  .add('with custom close behaviour', () => <WithCustomCloseBehaviour />)
  .add('headless', () => <Headless />);

function Default() {
  return (
    <DialogRoot>
      <Dialog title={text('Title', 'Some title')} onClose={action('onClose')}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
        dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
        consequuntur?
      </Dialog>
    </DialogRoot>
  );
}

function WithCustomCloseBehaviour() {
  return (
    <DialogRoot>
      <Dialog
        title={text('Title', 'Some title')}
        customCloseBehaviour={
          <span style={{ cursor: 'pointer', color: theme.lib.colors.N800Dark }} onClick={action('onCustomClose')}>
            Custom close
          </span>
        }
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
        dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
        consequuntur?
      </Dialog>
    </DialogRoot>
  );
}

function WithoutBodyPadding() {
  return (
    <DialogRoot>
      <Dialog title={text('Title', 'Some title')} onClose={action('onClose')} withoutBodyPadding>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
        dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
        consequuntur?
      </Dialog>
    </DialogRoot>
  );
}

function ShowOverflow() {
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
    <DialogRoot>
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
    </DialogRoot>
  );
}

function Headless() {
  return (
    <DialogRoot>
      <Dialog headless>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
        dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
        consequuntur?
      </Dialog>
    </DialogRoot>
  );
}
