/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ForwardedRef, forwardRef } from 'react';

import { EventPlaceholder } from '@instana/components/types/components/SvgIcon/types';
import { Observable } from '@instana/observables';
import { Link } from '@instana/components';
import { Snapshot } from '@instana/types';

import { noop } from 'in-services/util/function';
import WithIcon from 'in-components/WithIcon';
import { useTheme } from 'in-themes';

import locals from './EntityLink.mless';

export type SnapshotMap = Map<keyof Snapshot, Snapshot[keyof Snapshot]>;

interface EntityLinkProps {
  label: string;
  plugin?: string;
  snapshot?: SnapshotMap;
  icon?: string;
  tooltip?: string;
  href?: string;
  href$?: Observable<string>;
  specialIndicator?: JSX.Element;
  subscriptComponent?: JSX.Element;
  onClick?: (e: EventPlaceholder) => void;
}

const EntityLink = forwardRef(function EntityLink(
  {
    label,
    plugin,
    snapshot,
    icon,
    tooltip,
    href,
    href$,
    specialIndicator,
    subscriptComponent,
    onClick = noop
  }: EntityLinkProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const theme = useTheme();
  const iconColor = (href$ || href) && theme.ids.color.option.blue['500'];

  const link = (
    <>
      {specialIndicator ? <span className={locals.specialIndicator} /> : null}
      <Link href={href$ ?? href} onClick={onClick}>
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
      <WithIcon plugin={plugin ?? ''} snapshot={snapshot} icon={icon} iconColor={iconColor} tooltip={tooltip}>
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
