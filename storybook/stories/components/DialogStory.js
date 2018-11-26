import { withKnobs, text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import DialogRoot from '../_helpers/DialogRoot';
import Dialog from 'in-new-components/Dialog';

storiesOf('Components/Dialog', module)
  .addDecorator(withKnobs)
  .add('default', () => <Default />);

function Default() {
  return (
    <DialogRoot>
      <Dialog title={text('Title', 'Some title')} onClose={action('onClose')}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis consequuntur?
      </Dialog>
    </DialogRoot>
  );
}
