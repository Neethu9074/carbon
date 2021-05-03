/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withKnobs, text } from '@storybook/addon-knobs';
import { createMapForm, createField } from 'formalistic';
import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import { Button } from '@instana/components';

import DialogWithSlideInView from 'in-new-components/Dialog/DialogWithSlideInView';
import SlideInView, { NoHeader } from 'in-new-components/SlideInView/SlideInView';
import FormBoundInput from 'in-components/form/Input/FormBoundInput';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import Stack from 'in-new-components/layout/Stack';
import Form from 'in-components/form/binding/Form';
import FormInput from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import theme from 'in-themes';

const WithPadding = ({ children }) => <div style={{ padding: '0 1.5rem 1.5rem' }}>{children}</div>;

export default {
  title: 'Molecules|Dialogs/DialogWithSlideInView',
  component: DialogWithSlideInView,
  decorators: [withKnobs]
};

export const TwoLevels = () => {
  const [slideInVisible, setSlideInVisible] = useState(false);
  let [secondLevelActive, setSecondLevelActive] = useState(false); // level0 or level1

  return (
    <div style={{ height: '50vh' }}>
      <DialogWithSlideInView
        title={'With two slide-ins'}
        onClose={action('onClose')}
        slideInViewVisible={slideInVisible}
        onSlideInViewTitleClick={() => {
          action('intercepting slide-in-View-Title clicking...')();
          if (secondLevelActive) {
            setSecondLevelActive(false);
          } else {
            setSlideInVisible(false);
          }
        }}
        slideInViewTitle={!secondLevelActive ? 'slide 1' : 'slide 2'}
        slideInViewComponent={
          <SlideInView
            enforceMaxHeightForStaticContent
            HeaderComponent={NoHeader}
            slideInContent={
              <WithPadding>
                <p>This is slide 2.</p>
                <Button onClick={() => setSecondLevelActive(false)}>Go back to previous slide: 1!</Button>
              </WithPadding>
            }
            showSlideInContent={secondLevelActive}
            staticContent={
              <WithPadding>
                <p>This is slide 1.</p>
                <Button onClick={() => setSecondLevelActive(true)}>Go to next slide: 2!</Button>
              </WithPadding>
            }
          />
        }
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
          dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
          consequuntur?
        </p>
        <Button
          kind={'primary'}
          onClick={() => {
            setSlideInVisible(true);
          }}
        >
          Open Slides...
        </Button>
      </DialogWithSlideInView>
    </div>
  );
};

export const Default = () => (
  <div>
    <DialogWithSlideInView title={text('Title', 'Some title')} onClose={action('onClose')}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio dolorem
      cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis consequuntur?
    </DialogWithSlideInView>
  </div>
);

export const Custom = () => (
  <div>
    <DialogWithSlideInView
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
    </DialogWithSlideInView>
  </div>
);

export const SlideIn = () => {
  const [slideInVisible, setSlideInVisible] = useState(false);
  return (
    <div>
      <DialogWithSlideInView
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
      </DialogWithSlideInView>
    </div>
  );
};

export const ResetScrollPosition = () => {
  const inner = React.useRef();
  return (
    <div>
      <DialogWithSlideInView
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
      </DialogWithSlideInView>
    </div>
  );
};

export const FocusingFirstItem = () => {
  const [slideInVisible, setSlideInVisible] = useState(false);
  const [form, setForm] = useState(createMapForm().put('value', createField({ value: 0 })));
  return (
    <DialogWithSlideInView
      title={'Some title'}
      slideInViewTitle={'SlideIn Title'}
      onSlideInViewTitleClick={() => setSlideInVisible(false)}
      titleIconType="lib_alerts_create"
      onClose={action('onClose')}
      doNotCloseOnOutsideClick
      slideInViewVisible={slideInVisible}
      slideInViewComponent={
        <Stack>
          <StackItem>
            <Label>Some field, just for grabbing the focus:</Label>
          </StackItem>
          <StackItem>
            <FormInput />
          </StackItem>
        </Stack>
      }
    >
      <Stack space="xxsmall">
        <StackItem>
          <Form form={form} setForm={setForm}>
            <FormBoundInput path="value" type="number" label="Field 1" />
          </Form>
        </StackItem>
        <StackItem>
          <p>Value: {form.get('value')?.value}</p>
          <p>Please slide in and out, then change value (which triggers a re-rendering)...</p>
        </StackItem>
        <StackItem>
          <Button onClick={() => setSlideInVisible(true)}>SlideIn</Button>
        </StackItem>
      </Stack>
    </DialogWithSlideInView>
  );
};
