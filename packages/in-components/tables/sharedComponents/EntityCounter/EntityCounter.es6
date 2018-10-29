import React from 'react';

import Counter from 'in-components/tables/ServerTable/components/Counter';
import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EntityCounter.mless';

export default function EntityCounter({ icon, count }) {
  return (
    <div className={locals.flexWrapper}>
      <SvgIcon className={locals.entityIcon} type={icon} width={24} height={24} />
      {count >= 0 && <Counter>{number.compact(count)}</Counter>}
    </div>
  );
}
