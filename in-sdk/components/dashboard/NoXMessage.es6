import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import './NoXMessage.less';

const block = 'in-dash-no-x';

export default function NoXMessage({ children, className, centered }) {
  return (
    <div
      className={evaluateClassNames({
        [block]: true,
        [`${block}--centered`]: centered,
        [className]: className
      })}
    >
      <SvgIcon type="crossed_circle" width={16} className={`${block}__icon`} />{children}
    </div>
  );
}
