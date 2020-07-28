import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './DefaultInput.mless';

export default function DefaultInput({ isOpen, getInputProps, getToggleButtonProps, openMenu, placeholder }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.inputGroup]: true,
        [locals.inputGroupOpen]: isOpen
      })}
    >
      <input className={locals.input} {...getInputProps({ onFocus: openMenu })} placeholder={placeholder} />
      <SvgIcon
        className={locals.toggleButton}
        {...getToggleButtonProps()}
        type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
      />
    </div>
  );
}
