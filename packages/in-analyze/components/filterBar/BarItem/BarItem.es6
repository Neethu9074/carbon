import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './BarItem.mless';

export default function BarItem({
  children,
  withoutTextTransform,
  active,
  isOpen,
  showArrow,
  notAvailable,
  onClick,
  refSetter
}) {
  return (
    <a
      className={evaluateClassNames({
        [locals.item]: true,
        [locals.active]: active,
        [locals.notAvailable]: notAvailable,
        [locals.withIcon]: showArrow,
        [locals.withoutTextTransform]: withoutTextTransform
      })}
      href=""
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        onClick();
      }}
      ref={refSetter}
    >
      {children}
      {showArrow && (
        <SvgIcon
          className={locals.icon}
          type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
          width={16}
          height={16}
        />
      )}
    </a>
  );
}
