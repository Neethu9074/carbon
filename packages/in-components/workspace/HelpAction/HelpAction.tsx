/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { SvgIcon, SvgIconProps } from '@instana/components';
import { Link } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import locals from './HelpAction.mless';

export type ScopePathIconSize = SvgIconProps['size'];

interface HelpActionProps {
  children: ReactNode;
  href?: string;
  external?: boolean;
  size?: ScopePathIconSize;
}

export default function HelpAction({ children, href, external, size = 'regular' }: HelpActionProps) {
  let content = (
    <SvgIcon
      type="lib_help_error_help_outline"
      className={classNames(locals.icon, { [locals.clickable]: href })}
      size={size}
    />
  );

  if (href) {
    content = (
      <Link href={href} external={external}>
        {content}
      </Link>
    );
  }

  return <Tooltip content={children}>{content}</Tooltip>;
}
