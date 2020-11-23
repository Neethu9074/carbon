import React, { forwardRef } from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Button.mless';

export default forwardRef(function Button(
  {
    isActive,
    renderContent,
    icon,
    dark = false,
    onClick,
    href$,
    appendTop,
    appendBottom,
    appendLeft,
    appendRight,
    className
  },
  ref
) {
  return (
    <Link
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.dark]: dark,
        [locals.appendTop]: appendTop,
        [locals.appendBottom]: appendBottom,
        [locals.appendLeft]: appendLeft,
        [locals.appendRight]: appendRight,
        [className]: className
      })}
      onClick={onClick}
      href$={href$}
      ref={ref}
    >
      {icon && (
        <SvgIcon
          className={evaluateClassNames({
            [locals.icon]: true,
            [locals.active]: isActive
          })}
          type={icon}
        />
      )}
      {renderContent && renderContent()}
    </Link>
  );
});
