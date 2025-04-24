/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';

import locals from 'in-components/FloatingActionButton/FloatingActionButton.mless';

/* same scheme as used for IconButtons */
export const kinds = ['primaryv2', 'action'];

interface Props {
  children: ReactNode;
  icon?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
  withBoxShadow?: boolean;
  kind?: string;
}

export default forwardRef<HTMLButtonElement, Props>(function FloatingActionButton(
  { children, icon, onClick, withBoxShadow, kind = 'primaryv2' },
  ref
) {
  return (
    <button
      ref={ref}
      className={classNames({
        [locals.button]: true,
        [locals.withShadow]: withBoxShadow,
        [locals[kind]]: true,
        [locals.hasIcon]: !!icon
      })}
      onClick={e => (onClick ? onClick(e) : stopPropagationAndPreventDefault(e))}
    >
      <div className={locals.inner}>
        {icon && (
          <SvgIcon
            className={classNames({
              [locals.iconHasMargin]: !!children,
              [locals.icon]: !!icon
            })}
            type={icon}
          />
        )}
        <div className={locals.label}>{children}</div>
      </div>
    </button>
  );
});
