import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import theme from 'in-themes/theme';

import locals from './BasicFilter.mless';

export default function BasicFilter({
  // style
  color,
  icon,
  size = 'default',
  removeIcon = 'lib_openclose_cancel',

  // control
  className,
  isDeactivated,
  isStatic,

  // events
  onClick,
  onRemove,

  // content
  children
}) {
  let style = null;
  if (color) {
    style = {
      borderLeft: `4px solid ${color}`
    };
  }
  if (color === null || isDeactivated) {
    style = {
      borderLeft: `1px solid ${theme.lib.colors.N400}`,
      paddingLeft: '1.1875rem'
    };
  }

  return (
    <div
      className={evaluateClassNames({
        [locals.filter]: true,
        [locals[size]]: true,
        [locals.withIcon]: icon,
        [locals.deactivated]: isDeactivated,
        [locals.static]: isStatic,
        [className]: className
      })}
      style={style}
      onClick={onClick}
    >
      <div className={locals.content}>
        {icon && <SvgIcon className={locals.icon} type={icon} width={24} height={24} />}
        {children}
      </div>

      {onRemove && (
        <div
          className={locals.removeButton}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        >
          <SvgIcon className={locals.removeIcon} type={removeIcon} width={16} height={16} />
        </div>
      )}
    </div>
  );
}
