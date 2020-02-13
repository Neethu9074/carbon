import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'in-new-components/IconButton/IconButton';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './SlideInView.mless';

export default function SlideInView({ sliderContent, children, slideIn, title, onTitleIconClick }) {
  const [scrollshadow, setScrollshadow] = useState(false);
  const { doSlideIn, style } = useCustomSlideInBehaviour(slideIn);

  return (
    <div className={locals.container}>
      <div
        style={style}
        onScroll={e => setScrollshadow(e.target.scrollTop > 0)}
        className={evaluateClassNames({
          [locals.slider]: true,
          [locals.slideIn]: doSlideIn
        })}
      >
        {sliderContent}
      </div>
      <div
        className={evaluateClassNames({
          [locals.header]: true,
          [locals.scrollShadow]: scrollshadow,
          [locals.slideIn]: slideIn
        })}
      >
        <span className={locals.titleContainer}>
          <IconButton iconSize="l" type="lib_arrow_left" onClick={onTitleIconClick} leftAligned />
          <h1 className={locals.title}>{title}</h1>
        </span>
      </div>
      <div className={locals.mainContentWrapper}>
        <div className={locals.mainContentInner}>
          <section
            className={evaluateClassNames({
              [locals.mainContent]: true,
              [locals.slideIn]: slideIn
            })}
          >
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}

// Safari keeps focus on the selected slideIn component, which leads to a broken ui when tagFilter dropdown is selected.
// For that we need to remove the slide-In so that Safari looses focus
function useCustomSlideInBehaviour(slideIn) {
  const [doSlideIn, setDoSlideIn] = useState(false);
  const [style, setStyle] = useState({});

  useEffect(
    () => {
      if (!slideIn) {
        setDoSlideIn(false);
        setTimeout(() => {
          setStyle({ display: 'none' });
        }, 500);
      } else {
        setStyle({ display: 'block' });
        setTimeout(() => {
          setDoSlideIn(true);
        }, 100);
      }
    },
    [slideIn]
  );
  return { doSlideIn, style };
}

SlideInView.propTypes = {
  children: PropTypes.node.isRequired,
  sliderContent: PropTypes.node,
  slideIn: PropTypes.bool,
  title: PropTypes.string,
  onTitleIconClick: PropTypes.func
};
