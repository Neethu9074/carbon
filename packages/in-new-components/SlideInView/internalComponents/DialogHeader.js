import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import IconButton from 'in-new-components/IconButton/IconButton';

import locals from './DialogHeader.mless';

export default function DialogHeader({ title, onTitleIconClick, scrollShadow }) {
  return (
    <div
      className={classNames({
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

DialogHeader.propTypes = {
  scrollShadow: PropTypes.bool,
  title: PropTypes.node.isRequired,
  onTitleIconClick: PropTypes.func
};
