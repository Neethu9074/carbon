/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Button as CarbonButton, ButtonProps, SvgIcon } from '@instana/components';
import { Button } from '@instana/legacy';

import { carbonButtonEnabled } from 'in-services/featureFlags';

import locals from './DropdownButton.mless';

interface Props extends ButtonProps {
  expanded?: boolean;
  className?: string;
  spanClassName?: string;
  // temporary prop till breadcrumb button is migrated
  isBreadCrumbButton?: boolean | undefined;
}

const DropdownButton = React.forwardRef<HTMLButtonElement, Props>(function DropdownButton(
  { children, expanded, size, kind, icon, isBreadCrumbButton, className = '', spanClassName, ...buttonProps },
  ref
) {
  const isCarbonUsed = carbonButtonEnabled && !isBreadCrumbButton;
  const Component = isCarbonUsed ? CarbonButton : Button;

  return (
    <Component
      {...buttonProps}
      //@ts-expect-error kind is different for legacy button
      kind={kind}
      ref={ref}
      size={size ? size : isCarbonUsed ? 'compact' : undefined}
      icon={isCarbonUsed ? (expanded ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down') : icon}
      className={classNames(className, { [locals.dropdownButton]: !isCarbonUsed })}
      aria-haspopup
      aria-expanded={expanded}
    >
      {isCarbonUsed ? (
        <>
          {icon && <SvgIcon size="xs" type={icon} className={locals.carbonDropdownButtonIndicator} />}
          <span className={spanClassName}>{children}</span>
        </>
      ) : (
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
      )}
    </Component>
  );
});
export default DropdownButton;
