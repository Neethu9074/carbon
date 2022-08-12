/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { Link } from '@instana/components';

import { noop } from 'in-services/util/function';
import WithIcon from 'in-components/WithIcon';
import theme from 'in-themes';

import locals from './EntityLink.mless';

const EntityLink = forwardRef(function EntityLink(
  { label, plugin, snapshot, icon, tooltip, href$, specialIndicator, subscriptComponent, onClick = noop },
  ref
) {
  const iconColor = href$ && theme.lib.colors.blue800;

  const link = (
    <>
      {specialIndicator ? <span className={locals.specialIndicator} /> : null}
      <Link href$={href$} onClick={onClick}>
        {label}
      </Link>
    </>
  );

  const tooltipContent = tooltip ? (
    <>{link}</>
  ) : (
    <>
      {link}
      {subscriptComponent}
    </>
  );

  const innerContent =
    plugin || snapshot || icon ? (
      <WithIcon plugin={plugin} snapshot={snapshot} icon={icon} iconColor={iconColor} tooltip={tooltip}>
        {tooltipContent}
      </WithIcon>
    ) : (
      tooltipContent
    );

  if (!specialIndicator) {
    return innerContent;
  }

  return <div ref={ref}>{innerContent}</div>;
});
export default EntityLink;
