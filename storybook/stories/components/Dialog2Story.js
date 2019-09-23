import { withKnobs, text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import DialogRoot from '../_helpers/DialogRoot';
import Dialog2 from 'in-new-components/Dialog2';

import theme from 'in-themes';

storiesOf('Components/Dialog2', module)
  .addDecorator(withKnobs)
  .add('default', () => <Default />)
  .add('custom', () => <Custom />);

function Default() {
  return (
    <DialogRoot>
      <Dialog2 title={text('Title', 'Some title')} onClose={action('onClose')}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
        dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
        consequuntur?
      </Dialog2>
    </DialogRoot>
  );
}

function Custom() {
  return (
    <DialogRoot>
      <Dialog2
        onClose={action('onClose')}
        renderCustomCloseBehaviour={() => (
          <span style={{ cursor: 'pointer', color: theme.lib.colors.N800Dark }} onClick={action('onCustomClose')}>
            Custom close
          </span>
        )}
        title="Title with icon"
        titleIconType="lib_flame"
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
        dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
        consequuntur?
      </Dialog2>
    </DialogRoot>
  );
}
