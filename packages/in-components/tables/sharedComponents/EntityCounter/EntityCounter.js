import React from 'react';

import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EntityCounter.mless';

export default function EntityCounter({ icon, count }) {
  return (
    <div className={locals.flexWrapper}>
      {icon && <SvgIcon className={locals.entityIcon} type={icon} width={24} height={24} />}
      {count >= 0 && <span>{number.compact(count)}</span>}
    </div>
  );
}
