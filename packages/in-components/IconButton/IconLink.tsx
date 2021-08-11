/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { IconComponentProps } from 'in-components/IconButton/types';
import Icon from 'in-components/IconButton/Icon';
import { useObservable } from '@instana/hooks';

import { stopPropagation } from 'in-services/util/function';

// @ts-ignore
import locals from './IconButton.mless';

interface IconLinkProps extends IconComponentProps {}

export const useObservableConfig = {
  // It is acceptable to very briefly keep outdated state in the href attribute.
  // We furthermore have some component usages that rely on this behavior.
  // Specifically for situations like this:
  // - link with href$ and onClick prop click
  // - [link is clicked]
  // - onClick causes a re-render of the component changing the href$
  // - useObservable removes the href to ensure consistent state because href$ changed
  // - [link click processing finished]
  // - browser no longer has a link to follow
  // - the new href$ observable emits a value and a new href is set for the link
  resetStateOnObservableChange: false
};

export default forwardRef<HTMLAnchorElement, IconLinkProps>(function IconLink(props: IconLinkProps, ref) {
  const {
    size = 'normal',
    kind = 'action',
    onClick,
    disabled,
    leftAligned,
    rightAligned,
    href,
    href$,
    className = ''
  } = props;
  const resolvedHref = useObservable(href$, [href$], useObservableConfig) || href;

  const classes = classNames({
    [locals.iconButton]: true,
    [locals[`iconButton--${kind}`]]: kind,
    [locals[size]]: size,
    [locals.rightAligned]: rightAligned,
    [locals.leftAligned]: leftAligned,
    [locals.disabled]: disabled,
    [className]: className
  });

  return (
    <a className={classes} ref={ref} href={resolvedHref} onClick={onClick ? onClick : stopPropagation}>
      <Icon {...props} />
    </a>
  );
});
