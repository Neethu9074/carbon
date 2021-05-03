/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SvgIcon, SvgIconSizes } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';

import locals from './IconButton.mless';

export const kinds = Object.freeze(['primary', 'primaryv2', 'action', 'create', 'danger', 'warning', 'info']);
const iconDimensions = {
  normal: 'regular',
  compact: 'xs'
};

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

const IconButton = forwardRef(function IconButton(
  {
    type,
    size = 'normal',
    iconSize,
    kind = 'action',
    onClick,
    disabled,
    leftAligned,
    rightAligned,
    refSetter,
    href,
    href$,
    className
  },
  ref
) {
  const willBeALink = href$ || href;
  const resolvedHref = useObservable(href$, [href$], useObservableConfig) || href;
  const content = (
    <SvgIcon
      type={type}
      size={iconSize || iconDimensions[size]}
      className={classNames({
        [locals.icon]: true,
        [locals[`icon--${kind}`]]: kind,
        [locals.disabled]: disabled
      })}
      tabIndex={-1}
    />
  );
  const classes = classNames({
    [locals.iconButton]: true,
    [locals[`iconButton--${kind}`]]: kind,
    [locals[size]]: size,
    [locals.rightAligned]: rightAligned,
    [locals.leftAligned]: leftAligned,
    [locals.disabled]: disabled,
    [className]: className
  });

  if (!willBeALink) {
    return (
      <button
        className={classes}
        onClick={e => (disabled ? stopPropagationAndPreventDefault(e) : onClick?.(e))}
        ref={ref || refSetter}
      >
        {content}
      </button>
    );
  }

  return (
    <a href={resolvedHref} className={classes} onClick={onClick ? onClick : stopPropagation} ref={ref || refSetter}>
      {content}
    </a>
  );
});

export default IconButton;

IconButton.propTypes = {
  disabled: PropTypes.bool,
  href: PropTypes.string,
  href$: PropTypes.object,
  kind: PropTypes.oneOf(kinds),
  onClick: PropTypes.func,
  iconSize: PropTypes.oneOf(Object.keys(SvgIconSizes)),
  size: PropTypes.oneOf(Object.keys(iconDimensions)),
  type: PropTypes.string.isRequired,
  leftAligned: PropTypes.bool,
  rightAligned: PropTypes.bool,
  refSetter: PropTypes.func,
  className: PropTypes.string
};
