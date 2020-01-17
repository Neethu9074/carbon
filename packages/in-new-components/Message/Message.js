import React, { useState } from 'react';
import PropTypes from 'prop-types';
import theme from 'in-themes';

import evaluateClassNames, { joinClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Message.mless';

const iconTypes = {
  neutral: 'lib_help_error_error_outline',
  warning: 'lib_help_error_warning_outline'
};

export default function Message({
  children,
  className,
  dismissible,
  type = 'neutral',
  withIcon,
  iconColor = theme.lib.colors.N600Light,
  small,
  transparent
}) {
  const [dismiss, setDismiss] = useState(false);

  return dismiss ? null : (
    <div
      className={joinClassNames(
        evaluateClassNames({
          [locals.message]: true,
          [locals.messageBg]: !transparent
        }),
        className
      )}
    >
      {withIcon && (
        <SvgIcon
          type={iconTypes[type]}
          className={evaluateClassNames({
            [locals.icon]: true,
            [locals.smallSize]: small
          })}
          color={iconColor}
          size={small && 's'}
        />
      )}
      <span
        className={evaluateClassNames({
          [locals.content]: true,
          [locals.smallSize]: small
        })}
      >
        {children}
      </span>
      {dismissible && (
        <span className={locals.dismissContainer}>
          <SvgIcon
            type="lib_openclose_cancel"
            className={evaluateClassNames({
              [locals.dismiss]: true,
              [locals.smallSize]: small
            })}
            onClick={() => setDismiss(true)}
            size={small && 's'}
          />
        </span>
      )}
    </div>
  );
}

Message.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  dismissible: PropTypes.bool,
  iconColor: PropTypes.string,
  small: PropTypes.bool,
  type: PropTypes.oneOf(Object.keys(iconTypes)),
  withIcon: PropTypes.bool,
  transparent: PropTypes.bool
};
