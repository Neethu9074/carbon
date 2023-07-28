/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Observable } from '@instana/observables';
import { LinkProps } from '@instana/components';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import locals from './SecondLevelNavigation.mless';

interface SecondLevelNavigationProps {
  className?: string;
  darkTheme?: boolean;
  hasGroups?: boolean;
}

export function SecondLevelNavigation({
  className,
  children,
  darkTheme = false,
  hasGroups = false
}: React.PropsWithChildren<SecondLevelNavigationProps>) {
  let content = (
    <div
      className={classNames({
        [locals.tabList]: true,
        [locals.tabListLight]: darkTheme,
        [locals.tabListWithGroups]: hasGroups,
        // @ts-expect-error classNames can explicitly handle undefined keys
        [className]: className
      })}
    >
      {children}
    </div>
  );
  return (
    <div
      className={classNames({
        [locals.nav]: true,
        [locals.navLight]: darkTheme
      })}
    >
      {content}
    </div>
  );
}

interface SecondLevelNavigationItemProps extends Pick<LinkProps, 'className' | 'href' | 'onClick'> {
  href$?: Observable<string>;
  isActive?: boolean;
  isDisabled?: boolean;
  label?: React.ReactNode;
  icon?: string;
  postIcon?: string;
  addSeparator?: boolean;
  addGroupSeparator?: boolean;
}

export function SecondLevelNavigationItem({
  className,
  isActive,
  href$,
  href,
  onClick,
  isDisabled,
  label,
  icon,
  postIcon,
  addSeparator,
  addGroupSeparator
}: SecondLevelNavigationItemProps) {
  return (
    <Link
      className={classNames({
        [locals.link]: true,
        [locals.addSeparator]: addSeparator,
        [locals.addGroupSeparator]: addGroupSeparator,
        // @ts-expect-error classNames can explicitly handle undefined keys
        [className]: className
      })}
      href={href$ ?? href}
      onClick={onClick}
    >
      <div
        className={classNames({
          [locals.tab]: true,
          [locals.tabSelected]: isActive,
          [locals.tabDisabled]: isDisabled
        })}
      >
        <div className={locals.content}>
          {icon && <SvgIcon className={locals.icon} type={icon} size="s" />}
          {label}
          {postIcon && <SvgIcon className={locals.postIcon} type={postIcon} size="s" />}
        </div>
      </div>
    </Link>
  );
}

interface SecondLevelNavigationGroupProps {
  label: React.ReactNode;
  isActive?: boolean;
  withSeparator?: boolean;
}

export function SecondLevelNavigationGroup({
  label,
  children,
  withSeparator,
  isActive
}: React.PropsWithChildren<SecondLevelNavigationGroupProps>) {
  if (!children) {
    return null;
  }

  return (
    <div className={locals.group}>
      <div
        className={classNames({
          [locals.groupLabel]: true,
          [locals.groupSelected]: isActive,
          [locals.groupLabelExtraMargin]: withSeparator
        })}
      >
        {label}
      </div>
      <div className={locals.groupTabsWrapper}>{children}</div>
    </div>
  );
}
