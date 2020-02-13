import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Header from 'in-new-components/SlideInView/internalComponents/Header';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './LocalSlideInView.mless';

export default function LocalSlideInView({ sliderContent, children, slideIn, title, onTitleIconClick }) {
  const [scrollShadow, setScrollShadow] = useState(false);
  const { doSlideIn, style } = useCustomSlideInBehaviour(slideIn);

  return (
    <div className={locals.container}>
      {children}

      <div
        className={evaluateClassNames({
          [locals.inputBlocker]: true,
          [locals.slideIn]: slideIn
        })}
      />

      <div
        style={style}
        className={evaluateClassNames({
          [locals.slider]: true,
          [locals.slideIn]: doSlideIn
        })}
        onScroll={e => setScrollShadow(e.target.scrollTop > 0)}
      >
        {sliderContent}
      </div>

      <div
        className={evaluateClassNames({
          [locals.header]: true,
          [locals.slideIn]: slideIn
        })}
      >
        <Header scrollShadow={scrollShadow} title={title} onTitleIconClick={onTitleIconClick} />
      </div>
    </div>
  );
}

LocalSlideInView.propTypes = {
  children: PropTypes.node.isRequired,
  sliderContent: PropTypes.node,
  slideIn: PropTypes.bool,
  title: PropTypes.string,
  onTitleIconClick: PropTypes.func
};

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
