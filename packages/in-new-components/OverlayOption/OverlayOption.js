import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';
import { Li } from 'in-new-components/lists/List/List';

import locals from './OverlayOption.mless';

export default function OverlayOption({
  autoFocus,
  className,
  selectedValue,
  value,
  onChange,
  close,
  size,
  children,
  subList
}) {
  return (
    <Li
      className={classNames(locals.option, className)}
      noAlternatingBg
      autoFocus={autoFocus ?? selectedValue === value}
      subList={subList}
      size={size}
      onClick={() => {
        onChange(value);
        close();
      }}
    >
      {children}
    </Li>
  );
}

OverlayOption.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  selectedValue: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  subList: PropTypes.array,
  size: PropTypes.string
};
