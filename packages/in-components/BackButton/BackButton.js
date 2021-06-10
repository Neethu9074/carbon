/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import locals from './BackButton.mless';

export default function BackButton({ label, href, href$, withoutMargin }) {
  return (
    <Link
      className={classNames({
        [locals.link]: true,
        [locals.withoutMargin]: withoutMargin
      })}
      href={href}
      href$={href$}
    >
      <SvgIcon type="lib_arrow_expand_left" className={locals.icon} />
      {label}
    </Link>
  );
}
