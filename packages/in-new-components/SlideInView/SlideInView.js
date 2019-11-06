import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'in-new-components/IconButton/IconButton';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './SlideInView.mless';

export default function SlideInView({ sliderContent, children, slideIn, title, onTitleIconClick }) {
  const _title = useKeepTitleIfSet(title);
  return (
    <div className={locals.container}>
      <div
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
        <span className={locals.titleContainer}>
          <IconButton iconSize="l" type="lib_arrow_left" onClick={onTitleIconClick} leftAligned />
          <h1 className={locals.title}>{_title}</h1>
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

SlideInView.propTypes = {
  children: PropTypes.node.isRequired,
  sliderContent: PropTypes.node,
  slideIn: PropTypes.bool,
  title: PropTypes.string,
  onTitleIconClick: PropTypes.func
};

function useKeepTitleIfSet(title) {
  const [_title, setTitle] = useState(title);
  useEffect(
    () => {
      if (!_title) setTitle(title);
    },
    [title]
  );
  return _title;
}
