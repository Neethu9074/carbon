/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/legacy';

import Tooltip from 'in-components/Tooltip';

import locals from './HelpAction.mless';

interface HelpActionProps {
  children: ReactNode;
  href?: string;
  external?: boolean;
}

export default function HelpAction({ children, href, external }: HelpActionProps) {
  let content = (
    <SvgIcon type="lib_help_error_help_outline" className={classNames(locals.icon, { [locals.clickable]: href })} />
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
