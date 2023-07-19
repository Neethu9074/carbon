/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Observable } from '@instana/observables';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import locals from './BackButton.mless';

interface GeneralProps {
  label: string;
  withoutMargin?: boolean;
}

interface WithHref extends GeneralProps {
  href: string;
  href$?: Observable<string>;
}

interface WithHref$ extends GeneralProps {
  href$: Observable<string>;
  href?: string;
}

export type BackButtonProps = WithHref | WithHref$;

export default function BackButton({ label, href, href$, withoutMargin }: BackButtonProps) {
  return (
    <Link
      className={classNames({
        [locals.link]: true,
        [locals.withoutMargin]: withoutMargin
      })}
      href={href$ ?? href}
    >
      <SvgIcon type="lib_arrow_expand_left" className={locals.icon} />
      {label}
    </Link>
  );
}
