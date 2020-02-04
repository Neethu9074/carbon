import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Header from 'in-new-components/SlideInView/internalComponents/Header';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './GlobalSlideInView.mless';

export default function GlobalSlideInView({ sliderContent, children, slideIn, title, onTitleIconClick }) {
  const [scrollShadow, setScrollShadow] = useState(false);
  return (
    <>
      {children}

      <div
        className={evaluateClassNames({
          [locals.inputBlocker]: true,
          [locals.slideIn]: slideIn
        })}
      />

      {slideIn && <DisabledBodyScroll />}

      <div
        onScroll={e => setScrollShadow(e.target.scrollTop > 0)}
        className={evaluateClassNames({
          [locals.slider]: true,
          [locals.slideIn]: slideIn
        })}
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
    </>
  );
}

GlobalSlideInView.propTypes = {
  children: PropTypes.node.isRequired,
  sliderContent: PropTypes.node,
  slideIn: PropTypes.bool,
  title: PropTypes.string,
  onTitleIconClick: PropTypes.func
};
