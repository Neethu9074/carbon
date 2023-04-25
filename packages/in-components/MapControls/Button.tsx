/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { LinkProps, SvgIcon } from '@instana/components';
import { Observable } from '@instana/observables';
import { Link } from '@instana/components';

import locals from './Button.mless';

interface Props {
  isActive?: boolean;
  renderContent?: () => React.ReactNode;
  icon?: string;
  dark?: boolean;
  onClick?: LinkProps['onClick'];
  href?: string;
  href$?: Observable<string>;
  appendTop?: boolean;
  appendRight?: boolean;
  appendBottom?: boolean;
  appendLeft?: boolean;
  className?: string;
}

export default forwardRef<HTMLAnchorElement, Props>(function Button(
  {
    isActive,
    renderContent,
    icon,
    dark = false,
    onClick,
    href$,
    href,
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
      className={classNames({
        [locals.wrapper]: true,
        [locals.dark]: dark,
        [locals.appendTop]: appendTop,
        [locals.appendBottom]: appendBottom,
        [locals.appendLeft]: appendLeft,
        [locals.appendRight]: appendRight,
        // @ts-expect-error classnames explicitly can handle undefined object keys
        [className]: className
      })}
      onClick={onClick}
      href$={href$}
      href={href}
      ref={ref}
    >
      {icon && (
        <SvgIcon
          className={classNames({
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
