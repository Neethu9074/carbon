import { text } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import SlideInView from 'in-new-components/SlideInView/SlideInView';
import Button from 'in-new-components/Button/Button';

const styles = {
  margin: '0 auto',
  width: '80vw',
  height: '80vh',
  border: '1px solid black'
};
const CenterDecorator = storyFn => <div style={styles}>{storyFn()}</div>;

storiesOf('Components/SlideInView', module)
  .addParameters({ component: SlideInView })
  .addDecorator(CenterDecorator)
  .add('default', () => <Default />);

function Default() {
  const [slideInVisible, setSlideInVisible] = useState(false);
  return (
    <>
      <SlideInView
        title={text('Title', 'Some title')}
        slideIn={slideInVisible}
        sliderContent={
          <b>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
            dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
            consequuntur?
          </b>
        }
        onTitleIconClick={() => setSlideInVisible(false)}
      >
        <div style={{ marginTop: '5rem' }}>
          Vape single-origin coffee blog disrupt pop-up biodiesel. La croix knausgaard mumblecore microdosing tattooed
          butcher gastropub DIY cronut photo booth put a bird on it 90s edison bulb tbh. Readymade taiyaki try-hard ugh.
          Selfies mumblecore 90s, etsy fam asymmetrical hexagon poutine bushwick wolf air plant. Succulents hexagon
          disrupt raclette shaman hell of iPhone vaporware kinfolk. Craft beer pitchfork intelligentsia man braid
          skateboard.
        </div>
      </SlideInView>
      <Button onClick={() => setSlideInVisible(!slideInVisible)}>Slide In/Out</Button>
    </>
  );
}
