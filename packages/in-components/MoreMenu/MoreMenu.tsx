/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { MoreMenu as CarbonMoreMenu, MoreMenuProps } from '@instana/components';

export interface InteractiveElementsProps {
  ref: React.MutableRefObject<HTMLElement> | undefined;
  toggle: () => void;
}

export default function MoreMenu({
  children,
  kind = 'secondary',
  size = 'normal',
  className = '',
  renderInteractiveElement,
  ...props
}: MoreMenuProps) {
  return (
    <CarbonMoreMenu
      kind={kind}
      size={size}
      className={className}
      renderInteractiveElement={renderInteractiveElement}
      {...props}
    >
      {children}
    </CarbonMoreMenu>
  );
}
