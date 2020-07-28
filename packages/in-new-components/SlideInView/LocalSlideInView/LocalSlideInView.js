import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import DialogHeaderComponent from 'in-new-components/SlideInView/internalComponents/DialogHeader';
import ListHeaderComponent from 'in-new-components/SlideInView/internalComponents/ListHeader';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './LocalSlideInView.mless';

export const DialogHeader = DialogHeaderComponent;
export const ListHeader = ListHeaderComponent;

export default function LocalSlideInView({
  sliderContent,
  children,
  slideIn,
  title,
  onTitleIconClick,
  HeaderComponent = DialogHeader,
  transitionDurationMillis = 500
}) {
  const [scrollShadow, setScrollShadow] = useState(false);
  const { doSlideIn, style } = useCustomSlideInBehaviour(slideIn, transitionDurationMillis);
  const top = HeaderComponent === DialogHeader ? '5rem' : '3.5rem';

  return (
    <div className={locals.container}>
      <div className={locals.content}>{children}</div>

      <div
        style={{ top, transitionDuration: `${transitionDurationMillis}ms` }}
        className={evaluateClassNames({
          [locals.inputBlocker]: true,
          [locals.slideIn]: slideIn
        })}
      />

      <div
        style={{ ...style, top, transitionDuration: `${transitionDurationMillis}ms` }}
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
        <HeaderComponent scrollShadow={scrollShadow} title={title} onTitleIconClick={onTitleIconClick} />
      </div>
    </div>
  );
}

LocalSlideInView.propTypes = {
  children: PropTypes.node.isRequired,
  HeaderComponent: PropTypes.oneOf([DialogHeader, ListHeader]),
  sliderContent: PropTypes.node,
  slideIn: PropTypes.bool,
  title: PropTypes.string,
  onTitleIconClick: PropTypes.func,
  transitionDurationMillis: PropTypes.number
};

// Safari keeps focus on the selected slideIn component, which leads to a broken ui when tagFilter dropdown is selected.
// For that we need to remove the slide-In so that Safari looses focus
function useCustomSlideInBehaviour(slideIn, transitionDurationMillis) {
  const [doSlideIn, setDoSlideIn] = useState(false);
  const [style, setStyle] = useState({});

  let currentTimeout;
  function disposeTimeout() {
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
  }

  useEffect(() => {
    disposeTimeout();
    if (!slideIn) {
      setDoSlideIn(false);
      currentTimeout = setTimeout(() => {
        setStyle({ display: 'none' });
      }, transitionDurationMillis);
    } else {
      setStyle({ display: 'block' });
      currentTimeout = setTimeout(() => {
        setDoSlideIn(true);
      }, Math.ceil(transitionDurationMillis / 5));
    }
    return disposeTimeout;
  }, [slideIn, transitionDurationMillis]);
  return { doSlideIn, style };
}
