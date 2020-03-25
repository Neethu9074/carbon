import React, { useState } from 'react';
import PropTypes from 'prop-types';
import theme from 'in-themes';

import { neutral, success, warning, error } from 'in-new-components/Message/types';
import evaluateClassNames, { joinClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Message.mless';

export default function Message({
  children,
  className,
  dismissible,
  type = neutral,
  withIcon,
  bold,
  iconColor = theme.lib.colors.N600Light,
  small
}) {
  const [dismiss, setDismiss] = useState(false);

  return dismiss ? null : (
    <div
      className={joinClassNames(
        evaluateClassNames({
          [locals.message]: true,
          [locals.small]: small,
          [locals.bold]: bold,
          [locals[type]]: type
        }),
        className
      )}
    >
      {withIcon && <SvgIcon type={getIconByType(type)} className={locals.icon} color={iconColor} size={small && 's'} />}

      <span
        className={evaluateClassNames({
          [locals.content]: true,
          [locals.smallSize]: small
        })}
      >
        {children}
      </span>
      {dismissible && (
        <SvgIcon
          type="lib_openclose_cancel"
          className={evaluateClassNames({
            [locals.dismiss]: true,
            [locals.smallSize]: small
          })}
          onClick={() => setDismiss(true)}
          size={small && 's'}
        />
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
  bold: PropTypes.bool,
  type: PropTypes.oneOf([neutral, success, warning, error]),
  withIcon: PropTypes.bool
};

function getIconByType(type) {
  if (type === neutral) {
    return 'lib_help_error_info_outline';
  }
  if (type === success) {
    return 'lib_check';
  }
  if (type === warning) {
    return 'lib_help_error_warning_outline';
  }
  if (type === error) {
    return 'lib_help_error_warning';
  }
}
