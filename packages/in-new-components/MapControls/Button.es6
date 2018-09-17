import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Button.mless';

export default function Button({
  isActive,
  renderContent,
  icon,
  onClick,
  appendTop,
  appendBottom,
  appendLeft,
  appendRight
}) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.appendTop]: appendTop,
        [locals.appendBottom]: appendBottom,
        [locals.appendLeft]: appendLeft,
        [locals.appendRight]: appendRight
      })}
      onClick={onClick}
    >
      <SvgIcon
        className={evaluateClassNames({
          [locals.icon]: true,
          [locals.active]: isActive
        })}
        type={icon}
        width={24}
        height={24}
      />
      {renderContent && renderContent()}
    </div>
  );
}
