/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import SlideInView from 'in-new-components/SlideInView/SlideInView';
import Button from 'in-new-components/Button/Button';

export default {
  title: 'Templates|layout/SlideInView',
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
