import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Button.mless';

export default function Button({ iconType, onClick, width, height, isEnabled }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.button]: true,
        [locals.enabledButton]: isEnabled
      })}
      onClick={onClick}
    >
      <SvgIcon className={locals.icon} type={iconType} width={width || 24} height={height || 24} />
    </div>
  );
}
