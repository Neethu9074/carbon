import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './ListHeader.mless';

export default function ListHeader({ title, onTitleIconClick }) {
  return (
    <div className={locals.header}>
      <span className={locals.titleContainer}>
        <SvgIcon className={locals.icon} type="lib_arrow_expand_left" onClick={onTitleIconClick} />
        <span className={locals.title}>{title}</span>
      </span>
    </div>
  );
}

ListHeader.propTypes = {
  title: PropTypes.node.isRequired,
  onTitleIconClick: PropTypes.func
};
