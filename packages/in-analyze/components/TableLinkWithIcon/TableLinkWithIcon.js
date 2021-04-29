/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import classNames from 'classnames';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './TableLinkWithIcon.mless';

export default function TableLinkWithIcon({ icon, href$, href, onClick, children, isPrimary }) {
  return (
    <div className={locals.wrapper}>
      {icon && <SvgIcon className={locals.icon} type={icon} />}
      <Link
        className={classNames({
          [locals.link]: true,
          [locals.nonPrimary]: !isPrimary
        })}
        onClick={onClick}
        href$={href$}
        href={href}
      >
        {children}
      </Link>
    </div>
  );
}
