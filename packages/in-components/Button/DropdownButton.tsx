/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { Button as CarbonButton, ButtonProps, SvgIcon } from '@instana/components';

import { LegacyButton as Button } from 'in-components/Button/LegacyButton';

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
    title,
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
      title={title}
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
