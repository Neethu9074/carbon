import React from 'react';

import './StackTrace.less';

const block = 'in-stack-trace';

export default function StackTrace({ stackTrace }) {
  if (!stackTrace || stackTrace.size === 0) {
    return null;
  }

  return (
    <ol className={block}>
      {stackTrace.toArray().map((element, i) => (
        <li key={i} className={block + '__element'}>
          <span className={block + '__label'}>at</span>
          <span className={block + '__function'}>{element.get('m')}</span>
          <span className={block + '__label'}>in</span>
          <span className={block + '__file'}>{element.get('c', element.get('f'))}</span>
          {element.get('n') ? <span className={block + '__line'}>:{element.get('n')}</span> : null}
        </li>
      ))}
    </ol>
  );
}
