import PropTypes from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './LightCardV2.mless';

export default function LightCardV2({
  title,
  icon,
  children,
  leftHeaderContent,
  // Exists for backwards compatibility with the `light` theme.
  header,
  rightHeaderContent,
  className,
  headerClassName,
  bodyClassName,
  useMaxAvailableHeight
}) {
  if (header && !rightHeaderContent) {
    rightHeaderContent = header;
  }
  return (
    <div
      className={evaluateClassNames({
        [locals.card]: true,
        [className]: className,
        [locals.useMaxAvailableHeight]: useMaxAvailableHeight
      })}
    >
      <div
        className={evaluateClassNames({
          [locals.header]: true,
          [headerClassName]: headerClassName
        })}
      >
        <div className={locals.left}>
          {icon && <SvgIcon className={locals.icon} size="l" type={icon} />}
          <span className={locals.title}>{title}</span>
          {leftHeaderContent}
        </div>
        {rightHeaderContent && <div className={locals.right}>{rightHeaderContent}</div>}
      </div>

      <div
        className={evaluateClassNames({
          [locals.body]: true,
          [bodyClassName]: bodyClassName
        })}
      >
        {children}
      </div>
    </div>
  );
}

LightCardV2.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  leftHeaderContent: PropTypes.node,
  header: PropTypes.node,
  rightHeaderContent: PropTypes.node,
  useMaxAvailableHeight: PropTypes.bool
};
