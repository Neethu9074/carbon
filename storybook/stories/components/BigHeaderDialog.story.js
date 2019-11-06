import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import BigHeaderDialog from 'in-new-components/BigHeaderDialog';
import Button from 'in-new-components/Button/Button';
import DialogRoot from '../_helpers/DialogRoot';

import theme from 'in-themes';

storiesOf('Components/BigHeaderDialog', module)
  .addParameters({ component: BigHeaderDialog })
  .add('default', () => <Default />)
  .add('custom', () => <Custom />)
  .add('slideIn', () => <SlideIn />);

function Default() {
  return (
    <DialogRoot>
      <BigHeaderDialog title={text('Title', 'Some title')} onClose={action('onClose')}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
        dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
        consequuntur?
      </BigHeaderDialog>
    </DialogRoot>
  );
}

function Custom() {
  return (
    <DialogRoot>
      <BigHeaderDialog
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
      </BigHeaderDialog>
    </DialogRoot>
  );
}

function SlideIn() {
  const [slideInVisible, setSlideInVisible] = useState(false);
  return (
    <DialogRoot>
      <BigHeaderDialog
        title={'Some title'}
        slideInViewTitle={'SlideIn Title'}
        onSlideInViewTitleClick={() => setSlideInVisible(false)}
        titleIconType="lib_alerts_create"
        onClose={action('onClose')}
        doNotCloseOnOutsideClick
        slideInViewVisible={slideInVisible}
        slideInViewComponent={
          <div style={{ marginTop: '5rem' }}>
            Vape single-origin coffee blog disrupt pop-up biodiesel. La croix knausgaard mumblecore microdosing tattooed
            butcher gastropub DIY cronut photo booth put a bird on it 90s edison bulb tbh. Readymade taiyaki try-hard
            ugh. Selfies mumblecore 90s, etsy fam asymmetrical hexagon poutine bushwick wolf air plant. Succulents
            hexagon disrupt raclette shaman hell of iPhone vaporware kinfolk. Craft beer pitchfork intelligentsia man
            braid skateboard.
          </div>
        }
      >
        <div style={{ height: '10rem' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
          dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
          consequuntur?
          <Button onClick={() => setSlideInVisible(true)}>SlideIn</Button>
        </div>
      </BigHeaderDialog>
    </DialogRoot>
  );
}
