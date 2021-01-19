/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Li } from 'in-new-components/lists/List/List';

import locals from './OverlayOption.mless';

export const alignments = ['center', 'left'];

export default function OverlayOption({
  autoFocus,
  className,
  selectedValue,
  value,
  onChange,
  close,
  size,
  children,
  alignment,
  subList
}) {
  return (
    <Li
      className={classNames(locals.option, className, locals[`align-${alignment ?? 'center'}`])}
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
  size: PropTypes.string,
  alignment: PropTypes.oneOf(alignments)
};
