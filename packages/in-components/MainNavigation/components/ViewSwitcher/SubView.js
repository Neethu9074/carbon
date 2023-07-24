/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Stack, SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

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
  function SubMenuItem({ id, icon, isActive, label, href$, href, onClick, external, renderLabel }) {
    if (renderLabel) {
      return renderLabel(locals.link);
    }

    return (
      <Link
        id={id}
        href={href$ ?? href}
        onClick={onClick}
        external={external}
        className={classNames({
          [locals.link]: true,
          [locals.activeLink]: isActive
        })}
      >
        <Stack direction="horizontal" gap="small" align="center">
          {icon && <SvgIcon size="l" type={icon} color={theme.lib.colors.N400} aria-hidden="true" />}
          <span className={locals.label}>{label}</span>
        </Stack>
      </Link>
    );
  }
);
