/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './SubView.mless';

export default function SubView({ children }) {
  return <div className={locals.subView}>{children}</div>;
}

export const SubViewItem = connectTo(
  ({ isActive$ }) => {
    if (isActive$) {
      return { isActive: isActive$ };
    }
    return {};
  },
  function SubMenuItem({ id, isActive, label, href$, href, onClick, external, renderLabel }) {
    if (renderLabel) {
      return renderLabel(locals.link);
    }

    return (
      <Link
        className={classNames({
          [locals.link]: true,
          [locals.activeLink]: isActive
        })}
        href$={href$}
        href={href}
        onClick={onClick}
        external={external}
        id={id}
      >
        {label}
      </Link>
    );
  }
);
