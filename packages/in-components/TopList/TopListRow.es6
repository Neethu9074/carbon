import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import './TopListRow.less';

export default function TopListRow({ label, value, maxValue, unit, traces }) {
  const block = 'in-toplist-row';
  const tracesClass = `${block}__traces`;

  return (
    <div className={block}>
      <div className={`${block}__titles`}>
        <div>
          <h4>{label}</h4>
        </div>
        <div>
          <h4>{`${value}${unit}`}</h4>
        </div>
      </div>

      <div className={`${block}__bar`}>
        <div
          className={`${block}__bar-inner`}
          style={{
            width: `${value / maxValue * 100}%`,
            background: '#38f7ff'
          }}
        />
      </div>

      <div className={tracesClass}>
        <SvgIcon className={`${tracesClass}__trace`} type={'traces'} width={16} height={16} />
        {traces.map(trace => (
          <Link className={`${tracesClass}__trace`} href={'#'}>
            {trace}
          </Link>
        ))}
      </div>
    </div>
  );
}
