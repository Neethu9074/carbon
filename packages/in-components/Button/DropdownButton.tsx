/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button as CarbonButton, ButtonProps, SvgIcon } from '@instana/components';
import { Button } from '@instana/legacy';

import locals from './DropdownButton.mless';

interface Props extends ButtonProps {
  expanded?: boolean;
  className?: string;
  spanClassName?: string;
  // temporary prop till breadcrumb button is migrated
  isBreadCrumbButton?: boolean | undefined;
}

const DropdownButton = React.forwardRef<HTMLButtonElement, Props>(function DropdownButton(
  {
    children,
    expanded,
    size,
    kind,
    icon,
    darkTheme,
    isBreadCrumbButton,
    className = '',
    spanClassName,
    ...buttonProps
  },
  ref
) {
  const Component = isBreadCrumbButton ? Button : CarbonButton;

  return (
    <Component
      {...buttonProps}
      //@ts-expect-error kind is different for legacy button
      kind={kind}
      ref={ref}
      size={size ?? 'compact'}
      icon={isBreadCrumbButton ? icon : expanded ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
      className={className}
      aria-haspopup
      aria-expanded={expanded}
      {...(isBreadCrumbButton ? {} : { darkTheme: darkTheme })}
    >
      {isBreadCrumbButton ? (
        <>
          {/* Group into one flexbox item */}
          <span className={spanClassName}>{children}</span>

          <SvgIcon
            type={expanded ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'}
            className={classNames(locals.dropdownButtonIndicator, {
              [`icon-${size}`]: size
            })}
          />
        </>
      ) : (
        <>
          {icon && <SvgIcon size="xs" type={icon} className={locals.carbonDropdownButtonIndicator} />}
          <span className={spanClassName}>{children}</span>
        </>
      )}
    </Component>
  );
});
export default DropdownButton;
