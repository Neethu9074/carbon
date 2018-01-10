import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './TopListRow.mless';

export default function TopListRow({ label, value, maxValue, unit, traces }) {
  return (
    <li className={locals.topListRow}>
      <div className={locals.titles}>
        <div>
          <span>{label}</span>
        </div>
        <div>
          <span>{`${value}${unit}`}</span>
        </div>
      </div>

      <div className={locals.bar}>
        <div
          className={locals.barInner}
          style={{
            width: `${value / maxValue * 100}%`,
            background: '#38f7ff'
          }}
        />
      </div>

      <div className={`${locals.traces}`}>
        <SvgIcon className={locals.tracesRowItem} type="traces" width={16} height={16} />
        {traces.map(trace => (
          <Link className={`${locals.tracesRowItem} ${locals.trace}`} href={'#'}>
            {trace}
          </Link>
        ))}
      </div>
    </li>
  );
}
