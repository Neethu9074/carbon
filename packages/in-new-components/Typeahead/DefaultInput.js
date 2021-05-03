/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import locals from './DefaultInput.mless';

export default function DefaultInput({
  isOpen,
  getInputProps,
  getToggleButtonProps,
  openMenu,
  placeholder,
  maxLength
}) {
  return (
    <div
      className={classNames({
        [locals.inputGroup]: true,
        [locals.inputGroupOpen]: isOpen
      })}
    >
      <input
        className={locals.input}
        {...getInputProps({ onFocus: openMenu })}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      <SvgIcon
        className={locals.toggleButton}
        {...getToggleButtonProps()}
        type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
      />
    </div>
  );
}
