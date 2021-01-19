/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './LightCardV2.mless';

export default function LightCardV2({
  title,
  icon,
  children,
  leftHeaderContent,
  hasMarginBottom,
  // Exists for backwards compatibility with the `light` theme.
  header,
  rightHeaderContent,
  className,
  headerClassName,
  bodyClassName,
  useMaxAvailableHeight = true,
  size = 'l',
  onHeaderBackgroundClicked
}) {
  if (header && !rightHeaderContent) {
    rightHeaderContent = header;
  }
  return (
    <div
      className={classNames({
        [locals.card]: true,
        [className]: className,
        [locals.useMaxAvailableHeight]: useMaxAvailableHeight,
        [locals.hasMarginBottom]: hasMarginBottom
      })}
    >
      <div
        className={classNames({
          [locals.header]: true,
          [locals.noHeaderContent]: !title && !icon && !leftHeaderContent && !header && !rightHeaderContent,
          [headerClassName]: headerClassName
        })}
        onClick={onHeaderBackgroundClicked}
      >
        <div className={locals.left}>
          {icon && <SvgIcon className={locals.icon} size="l" type={icon} />}
          <span
            className={classNames({
              [locals.title]: true,
              [locals.small]: size === 's',
              [locals.large]: size === 'l'
            })}
          >
            {title}
          </span>
          {leftHeaderContent}
        </div>
        {rightHeaderContent && <div className={locals.right}>{rightHeaderContent}</div>}
      </div>

      <div
        className={classNames({
          [locals.body]: children ? true : false,
          [bodyClassName]: bodyClassName
        })}
      >
        {children}
      </div>
    </div>
  );
}

LightCardV2.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  icon: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  leftHeaderContent: PropTypes.node,
  header: PropTypes.node,
  rightHeaderContent: PropTypes.node,
  useMaxAvailableHeight: PropTypes.bool,
  hasMarginBottom: PropTypes.bool,
  onHeaderBackgroundClicked: PropTypes.func,
  size: PropTypes.oneOf(['s', 'l'])
};
