import React, { forwardRef } from 'react';

import DropdownButton from 'in-new-components/Button/DropdownButton';
import classNames from 'classnames';
import Button from 'in-new-components/Button/Button';

import locals from './DashboardHeaderButton.mless';

export default forwardRef(function DashboardHeaderButton(props, ref) {
  const { darkTheme, expanded, className, size = 'xl' } = props;
  const Component = expanded != null ? DropdownButton : Button;

  return (
    <Component
      {...props}
      kind={darkTheme ? 'info' : 'secondary'}
      size={size}
      className={classNames({
        [locals.light]: !darkTheme,
        [locals.dark]: darkTheme,
        [className]: className
      })}
      ref={ref}
    />
  );
});
