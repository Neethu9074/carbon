import React, { useState } from 'react';
import theme from 'in-themes';

import { neutral, success, warning, error } from 'in-new-components/Message/types';
import evaluateClassNames, { joinClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Message.mless';

export default function Message({
  children,
  title,
  description,
  className,
  dismissible,
  type = neutral,
  withIcon,
  bold,
  iconColor = theme.lib.colors.N600Light,
  small
}) {
  const [dismiss, setDismiss] = useState(false);

  // We have a small API mistake within this component. In contrast to most other components
  // this one accepts the title via the children prop. The following code path enables
  // usage of the component similar to our other card/list/header-like components.
  if (title && children && !description) {
    description = children;
  }

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
      <div className={locals.firstLine}>
        {withIcon && (
          <SvgIcon type={getIconByType(type)} className={locals.icon} color={iconColor} size={small && 's'} />
        )}

        <span
          className={evaluateClassNames({
            [locals.content]: true,
            [locals.smallSize]: small
          })}
        >
          {title || children}
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
      {description && (
        <div
          className={evaluateClassNames({
            [locals.description]: true,
            [locals.descriptionSmallSize]: small
          })}
        >
          {description}
        </div>
      )}
    </div>
  );
}

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
