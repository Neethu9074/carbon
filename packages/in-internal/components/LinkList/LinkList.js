/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import locals from './LinkList.mless';

export function LinkList({ children }) {
  return <ul className={locals.list}>{children}</ul>;
}

export function LinkListItem({ href, href$, label, description, children, external }) {
  const isLink = href || href$;
  return (
    <li className={locals.item}>
      {isLink && (
        <Link className={locals.label} href={href} href$={href$} external={external}>
          {label}
        </Link>
      )}
      {!isLink && <span className={locals.title}>{label}</span>}
      {description && <p className={locals.description}>{description}</p>}
      {children}
    </li>
  );
}
