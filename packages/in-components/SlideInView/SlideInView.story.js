/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';

import { Button } from '@instana/components';

import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import SlideInView from 'in-components/SlideInView/SlideInView';

export default {
  component: SlideInView
};

export function Default() {
  const [showSlideInContent, onShowSlideInContentChange] = useState(false);

  return (
    <>
      <div
        style={{
          margin: '1rem auto',
          maxWidth: '80vw',
          height: '15rem',
          border: '1px solid black'
        }}
      >
        <SlideInView
          staticContent={
            <>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem
                odio dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus
                reiciendis consequuntur?
              </p>

              <Button kind="secondary" onClick={() => alert('Alert from static content button')}>
                Trigger alert
              </Button>
            </>
          }
          slideInContent={
            <>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem
                odio dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus
                reiciendis consequuntur?
              </p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem
                odio dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus
                reiciendis consequuntur?
              </p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem
                odio dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus
                reiciendis consequuntur?
              </p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem
                odio dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus
                reiciendis consequuntur?
              </p>

              <Button kind="secondary" onClick={() => alert('Alert from slide in content button')}>
                Trigger alert
              </Button>
            </>
          }
          slideInContentTitle="Some title"
          showSlideInContent={showSlideInContent}
          onShowSlideInContentChange={onShowSlideInContentChange}
        />
      </div>

      <Button onClick={() => onShowSlideInContentChange(!showSlideInContent)}>Slide In/Out</Button>
    </>
  );
}

export function UsingRenderCallbackToAddSlideInContentFooter() {
  const [showSlideInContent, onShowSlideInContentChange] = useState(false);

  return (
    <>
      <div
        style={{
          margin: '1rem auto',
          maxWidth: '80vw',
          height: '400px',
          border: '1px solid black'
        }}
      >
        <SlideInView
          staticContent={
            <>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem
                odio dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus
                reiciendis consequuntur?
              </p>

              <Button kind="secondary" onClick={() => alert('Alert from static content button')}>
                Trigger alert
              </Button>
            </>
          }
          renderSlideInContent={addFooter => (
            <MySlideInContent
              addFooter={addFooter}
              close={() => {
                onShowSlideInContentChange(false);
              }}
            />
          )}
          slideInContentTitle="Some title"
          showSlideInContent={showSlideInContent}
          onShowSlideInContentChange={onShowSlideInContentChange}
        />
      </div>

      <Button onClick={() => onShowSlideInContentChange(!showSlideInContent)}>Slide In/Out</Button>
    </>
  );
}
function MySlideInContent({ addFooter, close }) {
  useEffect(() => {
    addFooter(
      <FormFooter withRoundedBottomBorder>
        <CancelButton
          onClick={() => {
            close();
          }}
        />
        <SaveButton />
      </FormFooter>
    );
    return () => {
      addFooter();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = [];
  for (let index = 0; index <= 8; index++) {
    content.push(
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere accusantium aliquid alias voluptatem odio
        dolorem cumque! Ad temporibus non fuga aut sequi et qui. Eaque fugiat sint, necessitatibus reiciendis
        consequuntur?
      </p>
    );
  }

  return (
    <>
      {content}
      <Button kind="secondary" onClick={() => alert('Alert from slide in content button')}>
        Trigger alert
      </Button>
    </>
  );
}
