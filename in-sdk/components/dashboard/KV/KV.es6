import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import './KV.less';

const block = 'in-dashboard-kv';

export default function KV({ k, v, size }) {
  if (v == undefined) {
    return null;
  }

  return (
    <div
      className={evaluateClassNames({
        [block]: true,
        [`${block}--${size}`]: size
      })}
    >
      <div className={`${block}__key`}>
        {k}
      </div>
      {v}
    </div>
  );
}
