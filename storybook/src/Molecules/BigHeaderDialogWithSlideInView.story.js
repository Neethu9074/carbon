import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import BigHeaderDialogWithSlideInView from 'in-new-components/BigHeaderDialog/BigHeaderDialogWithSlideInView';
import Button from 'in-new-components/Button/Button';
import theme from 'in-themes';

export default {
  title: 'Molecules|Dialogs/BigHeaderDialogWithSlideInView',
  component: BigHeaderDialogWithSlideInView,
  decorator: { text, action }
};

export const Default = () => (
  <div>
    <BigHeaderDialogWithSlideInView title={text('Title', 'Some title')} onClose={action('onClose')}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio dolorem
      cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis consequuntur?
    </BigHeaderDialogWithSlideInView>
  </div>
);

export const Custom = () => (
  <div>
    <BigHeaderDialogWithSlideInView
      onClose={action('onClose')}
      renderCustomCloseBehaviour={() => (
        <Button style={{ cursor: 'pointer', color: theme.lib.colors.N800Dark }} onClick={action('onCustomClose')}>
          Custom close
        </Button>
      )}
      title="Title with icon"
      titleIconType="lib_flame"
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio dolorem
      cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis consequuntur?
    </BigHeaderDialogWithSlideInView>
  </div>
);

export const SlideIn = () => {
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

export const ResetScrollPosition = () => {
  const inner = React.useRef();
  return (
    <div>
      <BigHeaderDialogWithSlideInView
        onClose={action('onClose')}
        renderCustomCloseBehaviour={removeScrollShadow => (
          <Button
            style={{ cursor: 'pointer', color: theme.lib.colors.N800Dark }}
            onClick={() => {
              inner.current.parentNode.scrollTo(0, 0);
              removeScrollShadow();
            }}
          >
            Scroll-to-top
          </Button>
        )}
        title="Title with icon"
        titleIconType="lib_flame"
      >
        <div ref={inner} style={{ height: 1000 }}>
          <p>Please scroll down to see scroll shadow on the header!</p>
          <p>Long text...</p>
          <p>Long text...</p>
          <p>Long text...</p>
          <p>Long text...</p>
          <p>Long text...</p>
          <p>Long text...</p>
          <p>Long text...</p>
          <p>Long text...</p>
          <p>Long text...</p>
          <p>Press button above to reset scroll position. Then the shadow will go away.</p>
        </div>
      </BigHeaderDialogWithSlideInView>
    </div>
  );
};
