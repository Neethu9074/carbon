import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';
import theme from 'in-themes';

import BigHeaderDialogWithSlideInView from 'in-new-components/BigHeaderDialog/BigHeaderDialogWithSlideInView';
import Button from 'in-new-components/Button/Button';

export default {
  title: 'Molecules|Dialogs/BigHeaderDialogWithSlideInView',
  component: BigHeaderDialogWithSlideInView,
  decorator: { text, action }
};

export const BigHeaderDialogWithSlideInViewDefault = () => (
  <div>
    <BigHeaderDialogWithSlideInView title={text('Title', 'Some title')} onClose={action('onClose')}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio dolorem
      cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis consequuntur?
    </BigHeaderDialogWithSlideInView>
  </div>
);

export const BigHeaderDialogWithSlideInViewCustom = () => (
  <div>
    <BigHeaderDialogWithSlideInView
      onClose={action('onClose')}
      renderCustomCloseBehaviour={() => (
        <span style={{ cursor: 'pointer', color: theme.lib.colors.N800Dark }} onClick={action('onCustomClose')}>
          Custom close
        </span>
      )}
      title="Title with icon"
      titleIconType="lib_flame"
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio dolorem
      cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis consequuntur?
    </BigHeaderDialogWithSlideInView>
  </div>
);

export const BigHeaderDialogWithSlideInViewSlideIn = () => {
  const [slideInVisible, setSlideInVisible] = useState(false);
  return (
    <div>
      <BigHeaderDialogWithSlideInView
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
      </BigHeaderDialogWithSlideInView>
    </div>
  );
};
