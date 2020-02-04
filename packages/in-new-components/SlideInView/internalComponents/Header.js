import PropTypes from 'prop-types';
import React from 'react';

import IconButton from 'in-new-components/IconButton/IconButton';
import evaluateClassNames from 'in-services/util/classnames';

import locals from './Header.mless';

export default function Header({ title, onTitleIconClick, scrollShadow }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.header]: true,
        [locals.scrollShadow]: scrollShadow
      })}
    >
      <span className={locals.titleContainer}>
        <IconButton iconSize="l" type="lib_arrow_left" onClick={onTitleIconClick} leftAligned />
        <h1 className={locals.title}>{title}</h1>
      </span>
    </div>
  );
}

Header.propTypes = {
  scrollShadow: PropTypes.bool,
  title: PropTypes.string,
  onTitleIconClick: PropTypes.func
};
