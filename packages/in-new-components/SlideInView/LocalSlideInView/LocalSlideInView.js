import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Header from 'in-new-components/SlideInView/internalComponents/Header';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './LocalSlideInView.mless';

export default function LocalSlideInView({ sliderContent, children, slideIn, title, onTitleIconClick }) {
  const [scrollShadow, setScrollShadow] = useState(false);
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
